const connection = require('../configs/db');
const helpers = require('../helpers/helpers');

const readProduct = (search, order, fieldOrder, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT * FROM categories WHERE name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT * FROM categories WHERE name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

const insertCategory = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO categories set ?', data, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const updateCategory = (data, id) => new Promise((resolve, reject) => {
  connection.query(
    'UPDATE categories set ? where category_id = ?',
    [data, id],
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const deleteCategory = (id) => new Promise((resolve, reject) => {
  connection.query('DELETE FROM categories where category_id = ?', id, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const checkExistCategory = (id) => new Promise((resolve, reject) => {
  connection.query('SELECT * FROM categories where category_id = ?', id, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const checkRealtionCategoryProduct = (id) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT products.* , categories.* FROM categories INNER JOIN products ON categories.category_id = products.category_id 
    WHERE categories.category_id = ?`,
    id,
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const viewCategoryDetail = (id) => new Promise((resolve, reject) => {
  connection.query('SELECT * FROM categories WHERE category_id = ?', id, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

module.exports = {
  readProduct,
  insertCategory,
  updateCategory,
  deleteCategory,
  checkExistCategory,
  checkRealtionCategoryProduct,
  viewCategoryDetail,
};
