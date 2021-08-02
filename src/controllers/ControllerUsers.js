import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs/promises';
import Jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { genAccessToken, genRefreshToken, genVerifEmailToken } from '../helpers/jwt.js';
import helpers from '../helpers/helpers.js';
import userModel from '../models/users.js';
import storeModel from '../models/stores.js';
import productModel from '../models/products.js';
import orderModel from '../models/orderProducts.js';
import imgProductsModel from '../models/imgProducts.js';
import { redis } from '../middlewares/Redis.js';

const readUser = async (req, res, next) => {
  const search = req.query.search || '';
  let order = req.query.order || '';
  if (order.toUpperCase() === 'ASC') {
    order = 'ASC';
  } else if (order.toUpperCase() === 'DESC') {
    order = 'DESC';
  } else {
    order = 'DESC';
  }
  let { fieldOrder } = req.query;
  if (fieldOrder) {
    if (fieldOrder.toLowerCase() === 'name') {
      fieldOrder = 'name';
    } else if (fieldOrder.toLowerCase() === 'date_of_birth') {
      fieldOrder = 'date_of_birth';
    } else {
      fieldOrder = 'user_id';
    }
  } else {
    fieldOrder = 'user_id';
  }
  try {
    let dataUsers;
    let pagination;
    const lengthRecord = Object.keys(await userModel.readUser(search, order, fieldOrder)).length;
    if (lengthRecord > 0) {
      const limit = req.query.limit || 5;
      const pages = Math.ceil(lengthRecord / limit);
      let page = req.query.page || 1;
      let nextPage = parseInt(page, 10) + 1;
      let prevPage = parseInt(page, 10) - 1;
      if (nextPage > pages) {
        nextPage = pages;
      }
      if (prevPage < 1) {
        prevPage = 1;
      }
      if (page > pages) {
        page = pages;
      } else if (page < 1) {
        page = 1;
      }
      const start = (page - 1) * limit;
      pagination = {
        countData: lengthRecord,
        pages,
        limit: parseInt(limit, 10),
        curentPage: parseInt(page, 10),
        nextPage,
        prevPage,
      };
      dataUsers = await userModel.readUser(search, order, fieldOrder, start, limit);
      helpers.responsePagination(res, 'success', 200, 'data users', dataUsers, pagination);
    } else {
      dataUsers = await userModel.readUser(search, order, fieldOrder);
      helpers.response(res, 'success', 200, 'data users', dataUsers);
    }
  } catch (error) {
    next(error);
  }
};

const insertUser = async (req, res, next) => {
  try {
    const checkExistUser = await userModel.checkExistUser(req.body.email, 'email');
    if (checkExistUser.length === 0) {
      const salt = await bcrypt.genSalt(10);
      let data = {
        name: req.body.name,
        email: req.body.email,
        roles: req.body.roles,
        password: await bcrypt.hash(req.body.password, salt),
        phone_number: req.body.phone_number,
        gender: req.body.gender,
        date_of_birth: req.body.date_of_birth,
        status: 'active',
      };
      const fileName = uuidv4() + path.extname(req.files.avatar.name);
      const savePath = path.join(path.dirname(''), '/public/img/avatars', fileName);
      data = { ...data, avatar: `public/img/avatars/${fileName}` };
      const addDataUser = await userModel.insertUser(data);
      if (addDataUser.affectedRows) {
        req.files.avatar.mv(savePath);
        if (req.body.roles === 'seller') {
          const store = {
            store_name: req.body.store_name,
            store_description: req.body.store_description,
            user_id: addDataUser.insertId,
          };
          await storeModel.insertStore(store);
        }
        helpers.response(res, 'success', 200, 'successfully added user data', addDataUser);
      }
    } else {
      helpers.responseError(res, 'Error', 422, 'Invalid input', {});
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const checkExistUser = await userModel.userStatus(req.body.email, 'active');
    if (checkExistUser.length > 0) {
      if (checkExistUser[0].verif_email === 0) {
        return helpers.responseError(res, 'Email not verified', 403, 'Email has not been verified', []);
      }
      const comparePassword = await bcrypt.compare(req.body.password, checkExistUser[0].password);
      if (comparePassword) {
        const {
          password, phone_number: phoneNumber, email, ...user
        } = checkExistUser[0];
        delete checkExistUser[0].password;
        const accessToken = await genAccessToken(user, { expiresIn: 60 * 60 });
        const refreshToken = await genRefreshToken(user, { expiresIn: 60 * 60 * 2 });
        helpers.response(res, 'Success', 200, 'Login success', { ...checkExistUser[0], accessToken, refreshToken });
      } else {
        helpers.responseError(res, 'Authorized failed', 401, 'Wrong password', {
          password: 'passwords dont match',
        });
      }
    } else {
      helpers.responseError(res, 'Authorized failed', 401, 'User not Found', {
        email: 'email not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refToken = req.body.refreshToken;
    if (!refToken) {
      return helpers.responseError(res, 'Authorized failed', 401, 'Server need refreshToken', []);
    }
    Jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          helpers.responseError(res, 'Authorized failed', 401, 'token expired', []);
        } else if (err.name === 'JsonWebTokenError') {
          helpers.responseError(res, 'Authorized failed', 401, 'token invalid', []);
        } else {
          helpers.responseError(res, 'Authorized failed', 401, 'token not active', []);
        }
      }
      // eslint-disable-next-line no-unused-vars
      const cacheRefToken = redis.get(`jwtRefToken-${decode.user_id}`, async (error, cacheToken) => {
        if (cacheToken === refToken) {
          delete decode.iat;
          delete decode.exp;
          redis.del(`jwtRefToken-${decode.user_id}`);
          const accessToken = await genAccessToken(decode, { expiresIn: 60 * 60 });
          const newRefToken = await genRefreshToken(decode, { expiresIn: 60 * 60 * 2 });
          helpers.response(res, 'Success', 200, 'AccessToken', { accessToken, refreshToken: newRefToken });
        } else {
          helpers.responseError(res, 'Authorized failed', 403, 'Wrong refreshToken', []);
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  try {
    // eslint-disable-next-line no-unused-vars
    redis.del(`jwtRefToken-${req.userLogin.user_id}`, (error, result) => {
      if (error) {
        next(error);
      } else {
        helpers.response(res, 'Logout', 200, 'Logout success', []);
      }
    });
  } catch (error) {
    next(error);
  }
};

const registerCustommer = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const data = {
      name: req.body.name,
      email: req.body.email,
      roles: 'custommer',
      password: await bcrypt.hash(req.body.password, salt),
      status: 'active',
    };
    const addDataUser = await userModel.insertUser(data);
    if (addDataUser.affectedRows) {
      helpers.response(res, 'success', 200, 'successfully added user data', addDataUser);
      delete data.password;
      delete data.email;
      const token = await genVerifEmailToken({ ...data, user_id: addDataUser.insertId }, { expiresIn: 60 * 60 });
      await helpers.sendVerifEmailRegister(token, req.body.email, req.body.name);
    }
  } catch (error) {
    next(error);
  }
};

const registerSeller = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const user = {
      name: req.body.name,
      email: req.body.email,
      roles: 'seller',
      password: await bcrypt.hash(req.body.password, salt),
      phone_number: req.body.phone_number,
      status: 'active',
    };
    const addDataUser = await userModel.insertUser(user);
    if (addDataUser.affectedRows) {
      const store = {
        store_name: req.body.store_name,
        user_id: addDataUser.insertId,
      };
      await storeModel.insertStore(store);
      helpers.response(res, 'success', 200, 'successfully added user data', addDataUser);
      delete user.password;
      delete user.email;
      const token = await genVerifEmailToken({ ...user, user_id: addDataUser.insertId }, { expiresIn: 60 * 60 });
      await helpers.sendVerifEmailRegister(token, req.body.email, req.body.name);
    }
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    let data = {
      name: req.body.name,
      phone_number: req.body.phone_number,
      gender: req.body.gender,
      date_of_birth: req.body.date_of_birth,
    };
    const getDataUser = await userModel.checkExistUser(req.params.id, 'user_id');
    if (Object.keys(getDataUser).length > 0) {
      if (req.body.new_password) {
        const comparePassword = await bcrypt.compare(req.body.old_password, getDataUser[0].password);
        if (comparePassword) {
          data = {
            ...data,
            password: await bcrypt.hash(req.body.new_password, salt),
          };
        } else {
          return helpers.response(res, 'failed', 401, "passwords don't match", []);
        }
      }
      if (req.body.email) {
        data = { ...data, email: req.body.email };
      }
      if (getDataUser[0].roles === 'custommer') {
        data = { ...data, roles: req.body.roles };
      }
      if (req.files) {
        if (req.files.avatar) {
          if (getDataUser[0].avatar && getDataUser[0].avatar.length > 10) {
            fs.unlink(path.join(path.dirname(''), `/${getDataUser[0].avatar}`));
          }
          const fileName = uuidv4() + path.extname(req.files.avatar.name);
          const savePath = path.join(path.dirname(''), '/public/img/avatars', fileName);
          data = { ...data, avatar: `public/img/avatars/${fileName}` };
          await req.files.avatar.mv(savePath);
        }
      }
      const changeDataUser = await userModel.updateUser(data, req.params.id);
      if (changeDataUser.affectedRows) {
        if (req.body.roles === 'seller') {
          const checkExistStore = await storeModel.checkExistStore(req.params.id, 'user_id');
          const store = {
            store_name: req.body.store_name,
            store_description: req.body.store_description,
            user_id: req.params.id,
          };
          if (checkExistStore.length === 0) {
            await storeModel.insertStore(store);
          } else if (checkExistStore.length > 0) {
            await storeModel.updateStore(store, checkExistStore[0].store_id);
          }
        }
        return helpers.response(res, 'success', 200, 'successfully updated user data', []);
      }
    } else {
      return helpers.response(res, 'failed', 404, 'the data you want to update does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const getDataUser = await userModel.checkExistUser(req.params.id, 'user_id');
    if (Object.keys(getDataUser).length > 0 && getDataUser[0].status !== 'deleted') {
      const checkRealtionUserOrder = await userModel.checkRealtionUserOrder(req.params.id);// cek punya order
      const checkExistStore = await storeModel.checkExistStore(req.params.id, 'user_id');// cek punya store
      let orderNotFinished = 0;
      let orderProductStore = 0;
      let haveOrder = 0;
      let haveOrderStore = 0;
      if (checkRealtionUserOrder.length > 0) {
        haveOrder = checkRealtionUserOrder.length;
        checkRealtionUserOrder.forEach((order) => {
          if (
            order.status === 'submit'
            || order.status === 'processed'
            || order.status === 'sent'
            || order.status === 'completed'
          ) {
            orderNotFinished += 1;
          }
        });
      }
      if (checkExistStore.length > 0) {
        const getAllProductsId = await productModel.checkExistProduct(checkExistStore[0].store_id, 'store_id'); // get semua produk toko tersebut
        const productsId = [];
        getAllProductsId.forEach((value) => productsId.push(value.product_id));
        const checkExistProductOnOrderDetails = await orderModel.checkExistProductOnOrderDetails(productsId.length === 0 ? '' : productsId);
        if (checkExistProductOnOrderDetails.length > 0) {
          haveOrderStore = checkExistProductOnOrderDetails.length;
          checkExistProductOnOrderDetails.forEach((orderStore) => {
            if (
              orderStore.status === 'submit'
              || orderStore.status === 'processed'
              || orderStore.status === 'sent'
              || orderStore.status === 'completed'
            ) {
              orderProductStore += 1;
            }
          });
        }
      }
      if (orderNotFinished > 0 && orderProductStore > 0) {
        helpers.responseError(res, 'Failed', 409,
          'the account cannot be deleted, there are orders in your shop and your orders that have not been completed', []);
      } else if (orderNotFinished > 0) {
        helpers.responseError(res, 'Failed', 409, 'the account cannot be deleted, there are orders that have not been completed', []);
      } else if (orderProductStore > 0) {
        helpers.responseError(res, 'Failed', 409, 'the account cannot be deleted, there are orders in your store that have not been completed', []);
      } else if (haveOrder > 0 && haveOrderStore > 0 && orderNotFinished === 0 && orderProductStore === 0) {
        const changeDataUser = await userModel.updateUser({ status: 'deleted' }, req.params.id);
        const changeDataStore = await storeModel.updateStore({ status: 'deleted' }, checkExistStore[0].store_id);
        if (changeDataStore.affectedRows && changeDataUser.affectedRows) {
          helpers.response(res, 'success', 200, 'successfully deleted user data', []);
        }
      } else if (haveOrder > 0 && orderNotFinished === 0) {
        const changeDataUser = await userModel.updateUser({ status: 'deleted' }, req.params.id);
        if (changeDataUser.affectedRows) {
          helpers.response(res, 'success', 200, 'successfully deleted user data', []);
        }
      } else if (haveOrderStore > 0 && orderProductStore === 0) {
        const changeDataUser = await userModel.updateUser({ status: 'deleted' }, req.params.id);
        const changeDataStore = await storeModel.updateStore({ status: 'deleted' }, checkExistStore[0].store_id);
        if (changeDataStore.affectedRows && changeDataUser.affectedRows) {
          helpers.response(res, 'success', 200, 'successfully deleted user data', []);
        }
      } else {
        if (checkExistStore.length > 0) {
          const getAllProductsId = await productModel.checkExistProduct(checkExistStore[0].store_id, 'store_id');
          getAllProductsId.forEach(async (value) => {
            const dataImgProduct = await imgProductsModel.getAllImgProduct(value.product_id);
            dataImgProduct.forEach((img) => {
              fs.unlink(path.join(path.dirname(''), `/${img.img_product}`));
            });
          });
        }
        const removeDataUser = await userModel.deleteUser(req.params.id);
        if (removeDataUser.affectedRows) {
          if (getDataUser[0].avatar && getDataUser[0].avatar.length > 10) {
            fs.unlink(path.join(path.dirname(''), `/${getDataUser[0].avatar}`));
          }
          helpers.response(res, 'success', 200, 'successfully deleted user data', []);
        }
      }
    } else {
      helpers.response(res, 'failed', 404, 'the data you want to delete does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

const verifregisteremail = (req, res, next) => {
  try {
    Jwt.verify(req.body.token, process.env.VERIF_EMAIL_TOKEN_SECRET, (err, decode) => {
      if (err) {
        return helpers.responseError(res, 'Verif failed', 403, 'Verif Register Email failed', []);
      }
      redis.get(`jwtEmailVerToken-${decode.user_id}`, async (error, result) => {
        if (result !== null) {
          const updateVerifEmail = await userModel.updateUser({ verif_email: 1 }, decode.user_id);
          if (updateVerifEmail.affectedRows) {
            redis.del(`jwtEmailVerToken-${decode.user_id}`);
            return helpers.response(res, 'success', 200, 'successfully verified email', []);
          }
        } else {
          const checkVerifEmail = await userModel.checkExistUser(decode.user_id, 'user_id');
          if (checkVerifEmail[0].verif_email === 1) {
            helpers.response(res, 'success', 201, 'Email is verified', []);
          } else if (checkVerifEmail[0].verif_email === 0) {
            helpers.responseError(res, 'Verif failed', 403, 'Verif Register Email failed', []);
          }
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

export default {
  insertUser,
  readUser,
  updateUser,
  deleteUser,
  login,
  registerCustommer,
  registerSeller,
  refreshToken,
  logout,
  verifregisteremail,
};
