import connection from '../configs/db.js';
import helpers from '../helpers/helpers.js';

const insertStore = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO stores set ?', data, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const checkExistStore = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM stores where ${field} = ?`, fieldValue, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const updateStore = (data, id) => new Promise((resolve, reject) => {
  connection.query('UPDATE stores set ? WHERE store_id = ?', [data, id], (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const storeProducts = (search, order, fieldOrder, storeId, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT *,(SELECT img_product FROM img_products WHERE img_products.product_id = products.product_id LIMIT 1) AS img_product
      FROM products WHERE (name LIKE "%${search}%" AND store_id = ${storeId}) ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT *,(SELECT img_product FROM img_products WHERE img_products.product_id = products.product_id LIMIT 1) AS img_product
      FROM products WHERE (name LIKE "%${search}%" AND store_id = ${storeId}) ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});
export default {
  insertStore,
  checkExistStore,
  updateStore,
  storeProducts,
};
