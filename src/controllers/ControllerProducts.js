import productModel from '../models/products.js';
import helpers from '../helpers/helpers.js';

const readProduct = async (req, res) => {
  const search = req.query.search || '';
  const order = req.query.order ? (req.query.order.toUpperCase() === 'ASC' ? 'ASC' : '' || req.query.order.toUpperCase() === 'DESC' ? 'DESC' : '') : 'DESC';
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
    const lengthRecord = Object.keys(await productModel.readProduct(search, order, fieldOrder)).length;
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
      dataProducts = await productModel.readProduct(search, order, fieldOrder, start, limit);
    } else {
      dataProducts = await productModel.readProduct(search, order, fieldOrder);
    }
    helpers.response(res, 'success', 200, 'data products', dataProducts);
  } catch (error) {
    console.log(error);
  }
};

const insertProduct = async (req, res) => {
  const {
    name,
    brand,
    category_id,
    price,
    colors,
    size,
    quantity,
    product_status,
    description,
  } = req.body;
  const data = {
    name,
    brand,
    category_id,
    price,
    colors,
    size,
    quantity,
    product_status,
    description,
    created_at: new Date(),
    updated_at: new Date(),
  };
  try {
    const checkCategoryId = Object.keys(await productModel.checkExistCategory(category_id)).length;
    if (checkCategoryId > 0) {
      const addDataProduct = await productModel.insertProduct(data);
      helpers.response(res, 'success', 200, 'successfully added product data', addDataProduct);
    } else {
      helpers.response(res, 'failed', 404, "The category id doesn't exist", []);
    }
  } catch (error) {
    console.log(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category_id,
      price,
      colors,
      size,
      quantity,
      product_status,
      description,
    } = req.body;
    const data = {
      name,
      brand,
      category_id,
      price,
      colors,
      size,
      quantity,
      product_status,
      description,
      updated_at: new Date(),
    };
    const checkCategoryId = Object.keys(await productModel.checkExistCategory(category_id)).length;
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
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  if (!req.params.id || !parseInt(req.params.id)) {
    helpers.response(res, 'error', 422, 'id must be a number and cannot empty', []);
  } else {
    try {
      const removeDataProduct = await productModel.deleteProduct(req.params.id);
      if (removeDataProduct.affectedRows) {
        helpers.response(res, 'success', 200, 'successfully deleted product data', []);
      } else {
        helpers.response(res, 'failed', 404, 'the data you want to delete does not exist', []);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export default {
  readProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
};
