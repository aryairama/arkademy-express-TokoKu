import connection from '../configs/db.js';
import helpers from '../helpers/helpers.js';

const readProduct = (search, order, fieldOrder, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT * FROM products WHERE name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT * FROM products WHERE name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

const insertProduct = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO products set ?', data, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const updateProduct = (data, id) => new Promise((resolve, reject) => {
  connection.query(
    'UPDATE products set ? where product_id = ? ',
    [data, id],
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const deleteProduct = (id) => new Promise((resolve, reject) => {
  connection.query(
    'DELETE FROM products where product_id = ?',
    id,
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const checkExistCategory = (id) => new Promise((resolve, reject) => {
  connection.query('SELECT category_id FROM categories where category_id = ?', id, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const checkExistProduct = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM products where ${field} = ?`, fieldValue, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const checkRealtionOrderDetailsProduct = (id) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT products.* , order_details.* FROM products INNER JOIN order_details ON products.product_id = order_details.product_id 
    WHERE products.product_id = ?`, id, (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const viewProductDetail = (id) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT categories.name AS category_name,products.* FROM products INNER JOIN categories ON products.category_id = categories.category_id
    WHERE products.product_id = ?`,
    id,
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const readProductCategory = (id) => new Promise((resolve, reject) => {
  connection.query('SELECT * FROM products where category_id = ?', id, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});
export default {
  readProduct,
  insertProduct,
  deleteProduct,
  updateProduct,
  checkExistCategory,
  checkExistProduct,
  checkRealtionOrderDetailsProduct,
  viewProductDetail,
  readProductCategory,
};
