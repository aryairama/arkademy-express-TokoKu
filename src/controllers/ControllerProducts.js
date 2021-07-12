import productModel from '../models/products.js';
import helpers from '../helpers/helpers.js';

const readProduct = async (req, res, next) => {
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
    let dataProducts;
    let pagination;
    const lengthRecord = Object.keys(await productModel.readProduct(search, order, fieldOrder)).length;
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
        pages,
        limit: parseInt(limit, 10),
        curentPage: parseInt(page, 10),
        nextPage,
        prevPage,
      };
      dataProducts = await productModel.readProduct(search, order, fieldOrder, start, limit);
      helpers.responsePagination(res, 'success', 200, 'data products', dataProducts, pagination);
    } else {
      dataProducts = await productModel.readProduct(search, order, fieldOrder);
      helpers.response(res, 'success', 200, 'data products', dataProducts);
    }
  } catch (error) {
    next(error);
  }
};

const insertProduct = async (req, res, next) => {
  const data = {
    name: req.body.name,
    brand: req.body.brand,
    category_id: req.body.category_id,
    price: req.body.price,
    colors: req.body.colors,
    size: req.body.size,
    quantity: req.body.quantity,
    product_status: req.body.product_status,
    description: req.body.description,
    created_at: new Date(),
    updated_at: new Date(),
  };
  try {
    const checkCategoryId = Object.keys(await productModel.checkExistCategory(data.category_id)).length;
    if (checkCategoryId > 0) {
      const addDataProduct = await productModel.insertProduct(data);
      helpers.response(res, 'success', 200, 'successfully added product data', addDataProduct);
    } else {
      helpers.response(res, 'failed', 404, "The category id doesn't exist", []);
    }
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      brand: req.body.brand,
      category_id: req.body.category_id,
      price: req.body.price,
      colors: req.body.colors,
      size: req.body.size,
      quantity: req.body.quantity,
      product_status: req.body.product_status,
      description: req.body.description,
      updated_at: new Date(),
    };
    const checkCategoryId = Object.keys(await productModel.checkExistCategory(data.category_id)).length;
    if (checkCategoryId > 0) {
      const changeDataProduct = await productModel.updateProduct(data, req.params.id);
      if (changeDataProduct.affectedRows) {
        helpers.response(res, 'success', 200, 'successfully updated product data', []);
      } else {
        helpers.response(res, 'failed', 404, 'the data you want to change does not exist', []);
      }
    } else {
      helpers.response(res, 'failed', 404, "The category id doesn't exist", []);
    }
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const removeDataProduct = await productModel.deleteProduct(req.params.id);
    if (removeDataProduct.affectedRows) {
      helpers.response(res, 'success', 200, 'successfully deleted product data', []);
    } else {
      helpers.response(res, 'failed', 404, 'the data you want to delete does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

export default {
  readProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
};
