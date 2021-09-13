const connection = require('../configs/db');
const helpers = require('../helpers/helpers');

const checkExistColor = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM colors WHERE ${field} = ?`, fieldValue, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const readColor = (search, order, fieldOrder, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT * FROM colors WHERE color_name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order} LIMIT ${start},${limit}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(`SELECT * FROM colors WHERE color_name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order}`, (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    });
  }
});

const checkColors = (id) => new Promise((resolve, reject) => {
  connection.query('SELECT * FROM colors WHERE color_id IN (?)', [id], (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const getAllColorProduct = (id) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT colors.* FROM color_product 
  INNER JOIN colors ON color_product.color_id = colors.color_id WHERE color_product.product_id = ?`,
    id,
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});
module.exports = {
  checkExistColor,
  checkColors,
  getAllColorProduct,
  readColor,
};
