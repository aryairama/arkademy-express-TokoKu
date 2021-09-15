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

module.exports = {
  insertAddress,
  batchUpdateSecondaryAddresses,
  checkExistAddress,
  checkExistPrimaryAddress,
};
