const connection = require('../configs/db');
const helpers = require('../helpers/helpers');

const insertImgProduct = (data) => new Promise((resolve, reject) => {
  connection.query(
    'INSERT INTO img_products (product_id, img_product) VALUES ?',
    [data.map((value) => [value.product_id, value.img_product])],
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const deleteImgProduct = (data, idProduct) => new Promise((resolve, reject) => {
  connection.query(`DELETE FROM img_products WHERE product_id = ${idProduct} AND (img_product_id) IN (?)`, [data], (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const checkImgProduct = (id, idProduct) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM img_products WHERE product_id = ${idProduct} AND (img_product_id) IN (?)`, [id], (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const getAllImgProduct = (id) => new Promise((resolve, reject) => {
  connection.query('SELECT * FROM img_products WHERE product_id = ?', id, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

module.exports = {
  insertImgProduct, deleteImgProduct, checkImgProduct, getAllImgProduct,
};
