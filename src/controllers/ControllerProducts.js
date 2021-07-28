import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import productModel from '../models/products.js';
import storeModel from '../models/stores.js';
import colorModel from '../models/colors.js';
import colorProductModel from '../models/color_product.js';
import imgProductsModel from '../models/imgProducts.js';
import helpers from '../helpers/helpers.js';
import { redis, clearRedisCache } from '../middlewares/Redis.js';

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
        countData: lengthRecord,
        pages,
        limit: parseInt(limit, 10),
        curentPage: parseInt(page, 10),
        nextPage,
        prevPage,
      };
      dataProducts = await productModel.readProduct(search, order, fieldOrder, start, limit);
      helpers.responsePagination(res, 'success', 200, 'data products', dataProducts, pagination);
      redis.set(
        `readProduct-${search}-${order}-${fieldOrder}-${limit}-${page}`,
        JSON.stringify({ data: dataProducts, pagination }),
      );
    } else {
      dataProducts = await productModel.readProduct(search, order, fieldOrder);
      helpers.response(res, 'success', 200, 'data products', dataProducts);
    }
  } catch (error) {
    next(error);
  }
};

const insertProduct = async (req, res, next) => {
  try {
    if (req.userLogin.roles === 'seller') {
      const dataStore = await storeModel.checkExistStore(req.userLogin.user_id, 'user_id');
      const data = {
        name: req.body.name,
        brand: req.body.brand,
        category_id: req.body.category_id,
        store_id: await dataStore[0].store_id,
        price: req.body.price,
        size: req.body.size,
        quantity: req.body.quantity,
        product_status: req.body.product_status,
        description: req.body.description,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const checkExistColor = await colorModel.checkColors(req.body.colors);
      const checkCategoryId = Object.keys(await productModel.checkExistCategory(data.category_id)).length;
      if (checkCategoryId > 0 && req.body.colors.length === checkExistColor.length) {
        const addDataProduct = await productModel.insertProduct(data);
        if (addDataProduct.affectedRows) {
          const imgProduct = [];
          if (Array.isArray(req.body.colors)) {
            await colorProductModel.insertColorProduct(req.body.colors, addDataProduct.insertId);
          } else {
            await colorProductModel.insertColorProduct([req.body.colors], addDataProduct.insertId);
          }
          if (Array.isArray(req.files.img_product)) {
            req.files.img_product.forEach((img) => {
              const fileName = uuidv4() + path.extname(img.name);
              const savePath = path.join(path.dirname(''), '/public/img/products', fileName);
              img.mv(savePath);
              imgProduct.push({
                product_id: addDataProduct.insertId,
                img_product: `public/img/products/${fileName}`,
              });
            });
          } else {
            const fileName = uuidv4() + path.extname(req.files.img_product.name);
            const savePath = path.join(path.dirname(''), '/public/img/products', fileName);
            req.files.img_product.mv(savePath);
            imgProduct.push({
              product_id: addDataProduct.insertId,
              img_product: `public/img/products/${fileName}`,
            });
          }
          const addDataImgProduct = await imgProductsModel.insertImgProduct(imgProduct);
          if (addDataImgProduct.affectedRows) {
            clearRedisCache('readProduct-*', 'readProductCategory/*');
            helpers.response(res, 'success', 200, 'successfully added product data', addDataProduct);
          }
        }
      } else {
        helpers.responseError(res, 'Wrong data', 404, 'the data entered is not correct', []);
      }
    } else {
      helpers.responseError(res, 'Access Denied', 403, 'You do not have permission for this service', []);
    }
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (req.userLogin.roles === 'seller') {
      const dataStore = await storeModel.checkExistStore(req.userLogin.user_id, 'user_id');
      const data = {
        name: req.body.name,
        brand: req.body.brand,
        category_id: req.body.category_id,
        store_id: await dataStore[0].store_id,
        price: req.body.price,
        size: req.body.size,
        quantity: req.body.quantity,
        product_status: req.body.product_status,
        description: req.body.description,
        updated_at: new Date(),
      };
      const checkColors = await colorModel.checkColors(req.body.colors);
      const checkCategoryId = Object.keys(await productModel.checkExistCategory(data.category_id)).length;
      const checkExistProduct = await productModel.checkExistProduct(req.params.id, 'product_id');
      if (checkColors.length === req.body.colors.length && checkCategoryId > 0 && checkExistProduct.length > 0) {
        const dataColorProduct = await colorProductModel.getColorProduct(req.params.id, 'product_id');
        const checkExistImgProducts = await imgProductsModel.checkImgProduct(req.body.old_img_product, req.params.id);
        const dataImgProduct = await imgProductsModel.getAllImgProduct(req.params.id);
        if (req.body.old_img_product && checkExistImgProducts.length !== req.body.old_img_product.length) {
          return helpers.responseError(res, 'Wrong data', 404, 'The data entered is not correct', []);
        }
        if (!req.body.img_product && req.body.old_img_product && dataImgProduct.length === req.body.old_img_product.length) {
          return helpers.responseError(res, 'Wrong action', 403, 'All product images cannot be deleted', []);
        }
        const recentColorProduct = [];
        dataColorProduct.forEach((color) => recentColorProduct.push(color.color_id));
        let deleteColorProduct = [];
        let insertColorProduct = [];
        if (Array.isArray(req.body.colors)) {
          deleteColorProduct = recentColorProduct.filter((x) => !req.body.colors.includes(x));
          insertColorProduct = req.body.colors.filter((x) => !recentColorProduct.includes(x));
        } else {
          deleteColorProduct = recentColorProduct.filter((x) => ![parseInt(req.body.colors, 10)].includes(x));
          insertColorProduct = [parseInt(req.body.colors, 10)].filter((x) => !recentColorProduct.includes(x));
        }
        if (deleteColorProduct.length > 0) {
          await colorProductModel.deleteColorProduct(deleteColorProduct, req.params.id);
        }
        if (insertColorProduct.length > 0) {
          await colorProductModel.insertColorProduct(insertColorProduct, req.params.id);
        }
        if (Array.isArray(req.body.old_img_product)) {
          checkExistImgProducts.forEach((img) => {
            fs.unlink(path.join(path.dirname(''), `/${img.img_product}`));
          });
          await imgProductsModel.deleteImgProduct(req.body.old_img_product, req.params.id);
        } else if (!Array.isArray(req.body.old_img_product) && req.body.old_img_product) {
          fs.unlink(path.join(path.dirname(''), `/${checkExistImgProducts[0].img_product}`));
          await imgProductsModel.deleteImgProduct([req.body.old_img_product], req.params.id);
        }
        const imgProduct = [];
        if (Array.isArray(req.body.img_product) && req.body.img_product) {
          req.files.img_product.forEach((img) => {
            const fileName = uuidv4() + path.extname(img.name);
            const savePath = path.join(path.dirname(''), '/public/img/products', fileName);
            img.mv(savePath);
            imgProduct.push({
              product_id: req.params.id,
              img_product: `public/img/products/${fileName}`,
            });
          });
        } else if (!Array.isArray(req.body.img_product) && req.body.img_product) {
          const fileName = uuidv4() + path.extname(req.files.img_product.name);
          const savePath = path.join(path.dirname(''), '/public/img/products', fileName);
          req.files.img_product.mv(savePath);
          imgProduct.push({
            product_id: req.params.id,
            img_product: `public/img/products/${fileName}`,
          });
        }
        if (req.body.img_product) {
          await imgProductsModel.insertImgProduct(imgProduct);
        }
        const changeDataProduct = await productModel.updateProduct(data, req.params.id);
        if (changeDataProduct.affectedRows) {
          clearRedisCache(`viewProductDetail/${req.params.id}`, 'readProductCategory/*', 'readProduct-*');
          helpers.response(res, 'success', 200, 'successfully updated product data', []);
        }
      } else {
        helpers.responseError(res, 'Wrong data', 404, 'the data entered is not correct', []);
      }
    } else {
      helpers.responseError(res, 'Access Denied', 403, 'You do not have permission for this service', []);
    }
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    if (req.userLogin.roles === 'seller') {
      const checkRealtion = await productModel.checkRealtionOrderDetailsProduct(req.params.id);
      const checkExistProduct = await productModel.checkExistProduct(req.params.id, 'product_id');
      if (checkExistProduct.length > 0) {
        if (checkRealtion.length === 0) {
          const dataImgProduct = await imgProductsModel.getAllImgProduct(req.params.id);
          const removeDataProduct = await productModel.deleteProduct(req.params.id);
          if (removeDataProduct.affectedRows) {
            dataImgProduct.forEach((img) => {
              fs.unlink(path.join(path.dirname(''), `/${img.img_product}`));
            });
            clearRedisCache(`viewProductDetail/${req.params.id}`, 'readProductCategory/*', 'readProduct-*');
            helpers.response(res, 'success', 200, 'successfully deleted product data', []);
          } else {
            helpers.response(res, 'failed', 404, 'the data you want to delete does not exist', []);
          }
        } else if (checkRealtion.length > 0) {
          helpers.response(
            res, 'data relation', 409, 'product data cannot be deleted because it is related to other data', [],
          );
        }
      } else {
        helpers.response(res, 'failed', 404, 'the data you want to delete does not exist', []);
      }
    } else {
      helpers.responseError(res, 'Access Denied', 403, 'You do not have permission for this service', []);
    }
  } catch (error) {
    next(error);
  }
};

const viewProductDetail = async (req, res, next) => {
  try {
    const detailProduct = await productModel.viewProductDetail(req.params.id);
    const imgProduct = await imgProductsModel.getAllImgProduct(req.params.id);
    const colorProduct = await colorModel.getAllColorProduct(req.params.id);
    imgProduct.forEach((img) => [delete img.product_id, delete img.img_product_id]);
    const product = {
      ...detailProduct[0],
      img_products: imgProduct,
      colors: colorProduct,
    };
    redis.set(`viewProductDetail/${req.params.id}`, JSON.stringify(product));
    helpers.response(res, 'success', 200, 'detail product', product);
  } catch (error) {
    next(error);
  }
};

const readProductCategory = async (req, res, next) => {
  try {
    const productByCategory = await productModel.readProductCategory(req.params.id);
    redis.set(`readProductCategory/${req.params.id}`, JSON.stringify(productByCategory));
    helpers.response(res, 'success', 200, 'data products', productByCategory);
  } catch (error) {
    next(error);
  }
};

export default {
  readProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
  viewProductDetail,
  readProductCategory,
};
