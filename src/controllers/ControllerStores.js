import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import helpers from '../helpers/helpers.js';
import storeModel from '../models/stores.js';
import usersModel from '../models/users.js';

const storeProducts = async (req, res, next) => {
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
    } else if (fieldOrder.toLowerCase() === 'price') {
      fieldOrder = 'price';
    } else if (fieldOrder.toLowerCase() === 'quantity') {
      fieldOrder = 'quantity';
    } else {
      fieldOrder = 'product_id';
    }
  } else {
    fieldOrder = 'product_id';
  }
  try {
    const dataStore = await storeModel.checkExistStore(req.userLogin.user_id, 'user_id');
    let dataProducts;
    let pagination;
    const lengthRecord = Object.keys(
      await storeModel.storeProducts(search, order, fieldOrder, dataStore[0].store_id),
    ).length;
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
      dataProducts = await storeModel.storeProducts(search, order, fieldOrder, dataStore[0].store_id, start, limit);
      helpers.responsePagination(res, 'success', 200, 'data products', dataProducts, pagination);
    } else {
      dataProducts = await storeModel.storeProducts(search, order, fieldOrder, dataStore[0].store_id);
      helpers.response(res, 'success', 200, 'data products', dataProducts);
    }
  } catch (error) {
    next(error);
  }
};

const viewDetailStore = async (req, res, next) => {
  try {
    const dataStore = await storeModel.checkExistStore(req.userLogin.user_id, 'user_id');
    const dataUser = await usersModel.checkExistUser(req.userLogin.user_id, 'user_id');
    const { email, phone_number: phoneNumber } = dataUser[0];
    helpers.response(res, 'success', 200, 'Detail Store', { ...dataStore[0], email, phone_number: phoneNumber });
  } catch (error) {
    next(error);
  }
};

const updateProfileStore = async (req, res, next) => {
  try {
    const store = await storeModel.checkExistStore(req.userLogin.user_id, 'user_id');
    let dataUser = {
      phone_number: req.body.phone_number,
    };
    const dataStore = {
      store_name: req.body.store_name,
      store_description: req.body.store_description,
    };
    if (req.files) {
      if (req.files.avatar) {
        if (req.userLogin.avatar && req.userLogin.avatar.length > 10) {
          fs.unlink(path.join(path.dirname(''), `/${req.userLogin.avatar}`));
        }
        const fileName = uuidv4() + path.extname(req.files.avatar.name);
        const savePath = path.join(path.dirname(''), '/public/img/avatars', fileName);
        dataUser = { ...dataUser, avatar: `public/img/avatars/${fileName}` };
        await req.files.avatar.mv(savePath);
      }
    }
    if (req.body.email.length > 3) {
      dataUser = { ...dataUser, email: req.body.email };
    }
    const updateUser = await usersModel.updateUser(dataUser, req.userLogin.user_id);
    const updateStore = await storeModel.updateStore(dataStore, store[0].store_id);
    if (updateUser.affectedRows && updateStore.affectedRows) {
      const user = await usersModel.checkExistUser(req.userLogin.user_id, 'user_id');
      delete user[0].password;
      helpers.response(res, 'success', 200, 'successfully updated profile store', user[0]);
    }
  } catch (error) {
    next(error);
  }
};

export default {
  storeProducts,
  viewDetailStore,
  updateProfileStore,
};
