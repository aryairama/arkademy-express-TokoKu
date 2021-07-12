import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs/promises';
import helpers from '../helpers/helpers.js';
import userModel from '../models/users.js';

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
    const lengthRecord = Object.keys(await userModel.readUser(search, order, fieldOrder)).length;
    if (lengthRecord > 0) {
      const limit = req.query.limit || 5;
      const pages = Math.ceil(lengthRecord / limit);
      let page = req.query.page || 1;
      if (page > pages) {
        page = pages;
      } else if (page < 1) {
        page = 1;
      }
      const start = (page - 1) * limit;
      dataUsers = await userModel.readUser(search, order, fieldOrder, start, limit);
    } else {
      dataUsers = await userModel.readUser(search, order, fieldOrder);
    }
    helpers.response(res, 'success', 200, 'data users', dataUsers);
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      avatar: req.body.destinationAvatar,
      phone_number: req.body.phone_number,
      gender: req.body.gender,
      date_of_birth: req.body.date_of_birth,
    };
    const addDataUser = await userModel.insertUser(data);
    helpers.response(res, 'success', 200, 'successfully added category data', addDataUser);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    let data = {
      name: req.body.name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      gender: req.body.gender,
      date_of_birth: req.body.date_of_birth,
    };
    const getDataUser = await userModel.checkExistUser(req.params.id);
    if (Object.keys(getDataUser).length > 0) {
      if (req.body.new_password) {
        const comparePassword = await bcrypt.compare(req.body.old_password, getDataUser[0].password);
        if (comparePassword) {
          data = {
            ...data,
            password: await bcrypt.hash(req.body.new_password, salt),
          };
        } else {
          if (req.body.destinationAvatar) {
            fs.unlink(path.join(path.dirname(''), `/${req.body.destinationAvatar}`));
          }
          return helpers.response(res, 'failed', 401, "passwords don't match", []);
        }
      }
      if (req.body.destinationAvatar) {
        fs.unlink(path.join(path.dirname(''), `/${getDataUser[0].avatar}`));
        data = {
          ...data,
          avatar: req.body.destinationAvatar,
        };
      }
      const changeDataUser = await userModel.updateUser(data, req.params.id);
      if (changeDataUser.affectedRows) {
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
    const getDataUser = await userModel.checkExistUser(req.params.id);
    if (Object.keys(getDataUser).length > 0) {
      fs.unlink(path.join(path.dirname(''), `/${getDataUser[0].avatar}`));
      const removeDataUser = await userModel.deleteUser(req.params.id);
      if (removeDataUser.affectedRows) {
        helpers.response(res, 'success', 200, 'successfully deleted user data', []);
      } else {
        helpers.response(res, 'failed', 404, 'the data you want to delete does not exist', []);
      }
    } else {
      helpers.response(res, 'failed', 404, 'the data you want to delete does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

export default {
  register, readUser, updateUser, deleteUser,
};
