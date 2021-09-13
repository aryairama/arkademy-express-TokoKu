const mysql = require('mysql2');
const connection = require('../configs/db');
const helpers = require('../helpers/helpers');

const checkProducts = (id) => new Promise((resolve, reject) => {
  connection.query(
    'SELECT * FROM products where product_id IN (?)',
    [id],
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const insertOrder = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO orders set ?', data, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const insertOrderDetails = (data) => new Promise((resolve, reject) => {
  connection.query(
    'INSERT INTO order_details (product_id, order_id, quantity, price, created_at, updated_at) VALUES ?',
    [
      data.map((value) => [
        value.product_id,
        value.order_id,
        value.quantity,
        value.price,
        value.created_at,
        value.updated_at,
      ]),
    ],
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const updateProducts = (data, id) => new Promise((resolve, reject) => {
  let query = '';
  data.forEach((value, index) => {
    query += mysql.format(
      'UPDATE products SET quantity = ? where product_id = ?;',
      [value, id[index]],
    );
  });
  connection.query(query, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const updateOrder = (data, id) => new Promise((resolve, reject) => {
  connection.query(
    'UPDATE orders set ? where order_id = ?',
    [data, id],
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const getUserOrder = (id) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT users.name, orders.order_id,orders.invoice_number,orders.total_price,orders.status,orders.created_at
    ,orders.updated_at FROM orders INNER JOIN users ON orders.user_id = users.user_id WHERE orders.order_id = ?`,
    id,
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const getOrderDetails = (id) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT products.name AS product_name,order_details.quantity,order_details.price
    FROM order_details
    INNER JOIN products ON order_details.product_id = products.product_id WHERE order_details.order_id = ?`,
    id,
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const readOrder = (search, order, fieldOrder, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT users.name, orders.* FROM orders INNER JOIN users ON orders.user_id = users.user_id
      WHERE (users.name LIKE "%${search}%" OR orders.invoice_number LIKE "%${search}%") ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT users.name, orders.* FROM orders INNER JOIN users ON orders.user_id = users.user_id
      WHERE (users.name LIKE "%${search}%" OR orders.invoice_number LIKE "%${search}%") ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

const checkExistProductOnOrderDetails = (id) => new Promise((resolve, reject) => {
  connection.query(`SELECT orders.status,orders.user_id,order_details.*
  FROM order_details INNER JOIN orders ON order_details.order_id = orders.order_id
  where product_id IN (?)`, [id], (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

module.exports = {
  checkProducts,
  insertOrder,
  insertOrderDetails,
  updateProducts,
  updateOrder,
  getOrderDetails,
  getUserOrder,
  readOrder,
  checkExistProductOnOrderDetails,
};
