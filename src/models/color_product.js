const connection = require('../configs/db');
const helpers = require('../helpers/helpers');

const insertColorProduct = (data, idProduct) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO color_product (product_id, color_id) VALUES ?',
    [data.map((value) => [idProduct, value])], (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    });
});

const deleteColorProduct = (data, idProduct) => new Promise((resolve, reject) => {
  connection.query(`DELETE FROM color_product WHERE product_id = ${idProduct} AND (color_id) IN (?)`, [data], (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const getColorProduct = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM color_product WHERE ${field} = ?`, fieldValue, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

module.exports = { insertColorProduct, getColorProduct, deleteColorProduct };
