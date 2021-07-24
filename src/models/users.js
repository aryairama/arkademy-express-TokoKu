import connection from '../configs/db.js';
import helpers from '../helpers/helpers.js';

const readUser = (search, order, fieldOrder, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT * FROM users WHERE (name LIKE "%${search}%" OR email LIKE "%${search}%") ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT * FROM users WHERE (name LIKE "%${search}%" OR email LIKE "%${search}%") ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

const insertUser = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO users set ?', data, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const updateUser = (data, id) => new Promise((resolve, reject) => {
  connection.query('UPDATE users set ? where user_id = ?', [data, id], (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const deleteUser = (id) => new Promise((resolve, reject) => {
  connection.query('DELETE FROM users where user_id = ?', id, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const checkExistUser = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM users where ${field} = ?`, fieldValue, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const checkRealtionUserOrder = (id) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT orders.*, orders.status AS order_status,users.user_id,users.roles AS user_role,users.email
  FROM users INNER JOIN orders on orders.user_id = users.user_id
  WHERE users.user_id = ?`,
    id,
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const userStatus = (email, status) => new Promise((resolve, reject) => {
  connection.query('SELECT * FROM users WHERE (email = ? AND status = ?)', [email, status], (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

export default {
  insertUser,
  readUser,
  deleteUser,
  checkExistUser,
  updateUser,
  checkRealtionUserOrder,
  userStatus,
};
