const mysql = require('mysql2');
const connection = require('../configs/db');
const helpers = require('../helpers/helpers');

const insertAddress = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO addresses set ?', data, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const batchUpdateSecondaryAddresses = (data, id) => new Promise((resolve, reject) => {
  let query = '';
  id.forEach((value) => {
    query += mysql.format(`UPDATE addresses SET primary_address = ${data} where address_id = ?;`, value);
  });
  connection.query(query, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const checkExistAddress = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM addresses where ${field} = ?`, fieldValue, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const checkExistPrimaryAddress = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT * FROM addresses where ${field} = ? AND primary_address = 1`,
    fieldValue,
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const readAddress = (userId, search, order, fieldOrder, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT * FROM addresses WHERE (label LIKE "%${search}%" OR recipients_name LIKE "%${search}%" OR city_or_subdistrict LIKE "%${search}%" 
      OR address LIKE "%${search}%" OR postal_code LIKE "%${search}%") AND user_id = ${userId}
      ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT * FROM addresses WHERE (label LIKE "%${search}%" OR recipients_name LIKE "%${search}%" OR city_or_subdistrict LIKE "%${search}%" 
      OR address LIKE "%${search}%" OR postal_code LIKE "%${search}%") AND user_id = ${userId}
      ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

const checkRealtion = (id) => new Promise((resolve, reject) => {
  connection.query(
    'SELECT addresses.* FROM addresses INNER JOIN orders ON orders.address_id = addresses.address_id WHERE addresses.address_id = ?',
    id,
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const getPrimaryAddress = (userId) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT * FROM addresses WHERE user_id = ${userId} AND primary_address = 1 
    ORDER BY primary_address DESC LIMIT 1`,
    (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const deleteAddress = (id) => new Promise((resolve, reject) => {
  connection.query('DELETE FROM addresses where address_id = ?', id, (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

const updateAddress = (data, id) => new Promise((resolve, reject) => {
  connection.query('UPDATE addresses set ? where address_id = ?', [data, id], (error, result) => {
    helpers.promiseResolveReject(resolve, reject, error, result);
  });
});

module.exports = {
  insertAddress,
  batchUpdateSecondaryAddresses,
  checkExistAddress,
  checkExistPrimaryAddress,
  readAddress,
  getPrimaryAddress,
  checkRealtion,
  deleteAddress,
  updateAddress,
};
