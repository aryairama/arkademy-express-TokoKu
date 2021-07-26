import connection from '../configs/db.js';
import helpers from '../helpers/helpers.js';

const checkExistColor = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM colors WHERE ${field} = ?`, fieldValue, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const checkColors = (id) => new Promise((resolve, reject) => {
  connection.query('SELECT * FROM colors WHERE color_id IN (?)', [id], (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

export default {
  checkExistColor,
  checkColors,
};
