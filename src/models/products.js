const connection = require('../configs/db');
const helpers = require('../helpers/helpers');

const readProduct = (search, order, fieldOrder, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT *,(SELECT img_product FROM img_products WHERE img_products.product_id = products.product_id LIMIT 1) AS img_product
      FROM products WHERE (name LIKE "%${search}%") AND (quantity >= 1) ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT *,(SELECT img_product FROM img_products WHERE img_products.product_id = products.product_id LIMIT 1) AS img_product
      FROM products WHERE (name LIKE "%${search}%") AND (quantity >= 1) ORDER BY ${fieldOrder} ${order}`,
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

const checkExistProductRelatedStore = (idProduct, idStore) => new Promise((resolve, reject) => {
  connection.query('SELECT * FROM products WHERE (product_id = ? AND store_id = ?)', [idProduct, idStore], (error, result) => {
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

const readProductCategory = (id, limit = '', start = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT *,(SELECT img_product FROM img_products WHERE img_products.product_id = products.product_id LIMIT 1) 
      AS img_product FROM products where category_id = ? LIMIT ${start},${limit}`,
      id,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT *,(SELECT img_product FROM img_products WHERE img_products.product_id = products.product_id LIMIT 1) 
      AS img_product FROM products where category_id = ?`,
      id,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});
module.exports = {
  readProduct,
  insertProduct,
  deleteProduct,
  updateProduct,
  checkExistCategory,
  checkExistProduct,
  checkRealtionOrderDetailsProduct,
  viewProductDetail,
  readProductCategory,
  checkExistProductRelatedStore,
};
