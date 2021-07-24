import { v4 as uuidv4 } from 'uuid';
import helpers from '../helpers/helpers.js';
import ordersModel from '../models/orders.js';
import usersModel from '../models/users.js';

const insertOrder = async (req, res, next) => {
  try {
    let error = 0;
    const checkUser = await usersModel.checkExistUser(req.body.user_id, 'user_id');
    const getDataProducts = await ordersModel.checkProducts(req.body.product_id);
    if (req.body.product_id.length === getDataProducts.length
    && req.body.product_id.length === req.body.quantity.length
    && checkUser.length > 0) {
      req.body.quantity.forEach((value, index) => {
        if (value > getDataProducts[index].quantity) {
          error += 1;
        }
      });
      if (error === 0) {
        const updateQuantityProducts = [];
        const orderDetails = [];
        let totalPrice = 0;
        getDataProducts.forEach((value, index) => {
          totalPrice += value.price * req.body.quantity[index];
          orderDetails.push({
            product_id: value.product_id,
            order_id: null,
            quantity: req.body.quantity[index],
            price: value.price * req.body.quantity[index],
            created_at: new Date(),
            updated_at: new Date(),
          });
          updateQuantityProducts.push(value.quantity - req.body.quantity[index]);
        });
        const Orders = {
          user_id: req.body.user_id,
          invoice_number: uuidv4(),
          total_price: totalPrice,
          status: 'submit',
          created_at: new Date(),
          updated_at: new Date(),
        };
        const addDataOrder = await ordersModel.insertOrder(Orders);
        orderDetails.forEach((orderDetail) => {
          orderDetail.order_id = addDataOrder.insertId;
        });
        const addDataOrderDetail = await ordersModel.insertOrderDetails(orderDetails);
        const updateDataProducts = await ordersModel.updateProducts(updateQuantityProducts, req.body.product_id);
        const updateDataProductsAffectedRows = updateQuantityProducts.length > 1
          ? updateDataProducts[0].affectedRows : updateDataProducts.affectedRows;
        if (addDataOrder.affectedRows && addDataOrderDetail.affectedRows && updateDataProductsAffectedRows) {
          helpers.response(res, 'success', 200, 'successfully added order data', []);
        }
      } else {
        helpers.response(res, 'failed', 422, 'the number of products purchased does not match', []);
      }
    } else {
      helpers.response(res, 'failed', 404, 'data not match', []);
    }
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const data = {
      status: req.body.status,
      updated_at: new Date(),
    };
    const changeDataOrder = await ordersModel.updateOrder(data, req.params.id);
    if (changeDataOrder.affectedRows) {
      helpers.response(res, 'success', 200, 'successfully updated order status', []);
    } else {
      helpers.response(res, 'failed', 404, 'the data you want to change does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

const viewOrderDetail = async (req, res, next) => {
  try {
    const userOrder = await ordersModel.getUserOrder(req.params.id);
    const orderDetails = await ordersModel.getOrderDetails(req.params.id);
    if (userOrder.length > 0 && orderDetails.length > 0) {
      res.json({
        name: userOrder[0].name,
        order_id: userOrder[0].order_id,
        invoice_number: userOrder[0].invoice_number,
        total_price: userOrder[0].total_price,
        status: userOrder[0].status,
        created_at: userOrder[0].created_at,
        updated_at: userOrder[0].updated_at,
        products: [...orderDetails],
      });
    } else {
      helpers.response(res, 'failed', 404, "The order id doesn't exist", []);
    }
  } catch (error) {
    next(error);
  }
};

const readOrder = async (req, res, next) => {
  const search = req.query.search || '';
  let order = req.query.order || '';
  let fieldOrder = req.query.fieldOrder || '';
  if (order.toUpperCase() === 'ASC') {
    order = 'ASC';
  } else if (order.toUpperCase() === 'DESC') {
    order = 'DESC';
  } else {
    order = 'DESC';
  }
  if (fieldOrder.toLowerCase() === 'total_price') {
    fieldOrder = 'total_price';
  } else {
    fieldOrder = 'order_id';
  }
  try {
    let dataOrders;
    let pagination;
    const lengthRecord = Object.keys(await ordersModel.readOrder(search, order, fieldOrder)).length;
    if (lengthRecord > 0) {
      const limit = req.query.limit || 5;
      const pages = Math.ceil(lengthRecord / limit);
      let page = req.query.page || 1;
      let nextPage = parseInt(page, 10) + 1;
      let prevPage = parseInt(page, 10) - 1;
      if (nextPage > pages) {
        nextPage = pages;
      }
      if (prevPage < 1) {
        prevPage = 1;
      }
      if (page > pages) {
        page = pages;
      } else if (page < 1) {
        page = 1;
      }
      const start = (page - 1) * limit;
      pagination = {
        countData: lengthRecord,
        pages,
        limit: parseInt(limit, 10),
        curentPage: parseInt(page, 10),
        nextPage,
        prevPage,
      };
      dataOrders = await ordersModel.readOrder(search, order, fieldOrder, start, limit);
      helpers.responsePagination(res, 'success', 200, 'data categories', dataOrders, pagination);
    } else {
      dataOrders = await ordersModel.readOrder(search, order, fieldOrder);
      helpers.response(res, 'success', 200, 'data categories', dataOrders);
    }
  } catch (error) {
    next(error);
  }
};

export default {
  insertOrder, updateOrderStatus, viewOrderDetail, readOrder,
};
