import connection from '../configs/db.js';
import helpers from '../helpers/helpers.js';

const insertStore = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO stores set ?', data, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

export default {
  insertStore,
};
