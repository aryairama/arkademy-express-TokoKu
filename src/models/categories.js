import connection from "../configs/db.js";
import helpers from "../helpers/helpers.js";

const readProduct = (search, order, fieldOrder, start = "", limit = "") => {
  return new Promise((resolve, reject) => {
    if (limit !== "" && start !== "") {
      connection.query(
        `SELECT * FROM categories WHERE name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
        (error, result) => {
          helpers.promiseResolveReject(resolve, reject, error, result);
        }
      );
    } else {
      connection.query(
        `SELECT * FROM categories WHERE name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order}`,
        (error, result) => {
          helpers.promiseResolveReject(resolve, reject, error, result);
        }
      );
    }
  });
};

const insertCategory = (data) => {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO categories set ?", data, (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    });
  });
};

const updateCategory = (data, id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE categories set ? where category_id = ?",
      [data, id],
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      }
    );
  });
};

const deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    connection.query("DELETE FROM categories where category_id = ?", id, (error, result) => {
      helpers.promiseResolveReject(resolve,reject,error,result)
    })
  })
}

export default { readProduct, insertCategory, updateCategory, deleteCategory };
