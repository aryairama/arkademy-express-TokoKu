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
export default {
  insertStore,
  checkExistStore,
  updateStore,
};
