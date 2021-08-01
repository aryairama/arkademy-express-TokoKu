import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import categoryModel from '../models/categories.js';
import helpers from '../helpers/helpers.js';

const readCategory = async (req, res, next) => {
  const StatusPagination = req.query.pagination || 'on';
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
    } else {
      fieldOrder = 'category_id';
    }
  } else {
    fieldOrder = 'category_id';
  }
  try {
    let dataCategories;
    let pagination;
    const lengthRecord = Object.keys(await categoryModel.readProduct(search, order, fieldOrder)).length;
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
      if (StatusPagination === 'on') {
        dataCategories = await categoryModel.readProduct(search, order, fieldOrder, start, limit);
        return helpers.responsePagination(res, 'success', 200, 'data categories', dataCategories, pagination);
      }
    }
    dataCategories = await categoryModel.readProduct(search, order, fieldOrder);
    return helpers.response(res, 'success', 200, 'data categories', dataCategories);
  } catch (error) {
    next(error);
  }
};

const insertCategory = async (req, res, next) => {
  let data = {
    name: req.body.name,
    created_at: new Date(),
    updated_at: new Date(),
  };
  try {
    const fileName = uuidv4() + path.extname(req.files.img_category.name);
    const savePath = path.join(path.dirname(''), '/public/img/categories', fileName);
    data = { ...data, img_category: `public/img/categories/${fileName}` };
    const addDataCategory = await categoryModel.insertCategory(data);
    if (addDataCategory.affectedRows) {
      await req.files.img_category.mv(savePath);
      helpers.response(res, 'success', 200, 'successfully added category data', addDataCategory);
    } else {
      helpers.response(res, 'failed', 500, 'internal server error', []);
    }
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    let data = {
      name: req.body.name,
      updated_at: new Date(),
    };
    const checkExistCategory = await categoryModel.checkExistCategory(req.params.id);
    if (checkExistCategory.length > 0) {
      if (req.files) {
        if (req.files.img_category) {
          fs.unlink(path.join(path.dirname(''), `/${checkExistCategory[0].img_category}`));
          const fileName = uuidv4() + path.extname(req.files.img_category.name);
          const savePath = path.join(path.dirname(''), '/public/img/categories', fileName);
          await req.files.img_category.mv(savePath);
          data = { ...data, img_category: `public/img/categories/${fileName}` };
        }
      }
      const changeDataCategory = await categoryModel.updateCategory(data, req.params.id);
      if (changeDataCategory.affectedRows) {
        helpers.response(res, 'success', 200, 'successfully updated category data', []);
      }
    } else {
      helpers.response(res, 'failed', 404, 'the data you want to change does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const checkRealtion = await categoryModel.checkRealtionCategoryProduct(req.params.id);
    const checkExistCategory = await categoryModel.checkExistCategory(req.params.id);
    if (checkExistCategory.length > 0) {
      if (checkRealtion.length === 0) {
        const removeDataCategory = await categoryModel.deleteCategory(req.params.id);
        if (removeDataCategory.affectedRows) {
          fs.unlink(path.join(path.dirname(''), `/${checkExistCategory[0].img_category}`));
          helpers.response(res, 'success', 200, 'successfully deleted category data', []);
        }
      } else if (checkRealtion.length > 0) {
        helpers.response(
          res, 'data relation', 409, 'product data cannot be deleted because it is related to other data', [],
        );
      }
    } else {
      helpers.response(res, 'failed', 404, 'the data you want to delete does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

const viewCategoryDetail = async (req, res, next) => {
  try {
    const detailCategory = await categoryModel.viewCategoryDetail(req.params.id);
    helpers.response(res, 'success', 200, 'detail category', { ...detailCategory[0] });
  } catch (error) {
    next(error);
  }
};

export default {
  readCategory, insertCategory, updateCategory, deleteCategory, viewCategoryDetail,
};
