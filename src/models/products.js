import connection from "../configs/db.js";
import helpers from "../helpers/helpers.js";

const readProduct = (search, order,fieldOrder, start = "", limit = "") => {
  return new Promise((resolve, reject) => {
    if (limit !== "" && start !== "") {
      connection.query(
        `SELECT * FROM products WHERE name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
        (error, result) => {
          helpers.promiseResolveReject(resolve, reject, error, result);
        }
      );
    } else {
      connection.query(
        `SELECT * FROM products WHERE name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order}`,
        (error, result) => {
          helpers.promiseResolveReject(resolve, reject, error, result);
        }
      );
    }
  });
};

const insertProduct = (data) => {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO products set ?", data, (error, result) => {
      helpers.promiseResolveReject(resolve, reject, error, result);
    });
  });
};

const updateProduct = (data, id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE products set ? where product_id = ? ",
      [data, id],
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      }
    );
  });
};

const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM products where product_id = ?",
      id,
      (error, result) => {
        helpers.promiseResolveReject(resolve, reject, error, result);
      }
    );
  });
};

const checkExistCategory = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT category_id FROM categories where category_id = ?`, id, (error, result) => {
      helpers.promiseResolveReject(resolve,reject,error,result)
    })
  })
}
export default {
  readProduct,
  insertProduct,
  deleteProduct,
  updateProduct,
  checkExistCategory,
};
