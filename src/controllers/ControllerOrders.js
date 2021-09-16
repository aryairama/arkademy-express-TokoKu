/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const { v4: uuidv4 } = require('uuid');
const helpers = require('../helpers/helpers');
const ordersModel = require('../models/orderProducts');
const storesModel = require('../models/stores');
const addressesModel = require('../models/addresses');
const { clearRedisCache, clearRedisCacheV2 } = require('../middlewares/Redis');

const insertOrder = async (req, res, next) => {
  try {
    const productId = [];
    let combineCartOrders = req.body.order.slice(0);
    combineCartOrders = combineCartOrders.reduce((accumulator, cur) => {
      const found = accumulator.find((elem) => elem.product_id === cur.product_id);
      if (found) {
        found.quantity += cur.quantity;
        found.prices += cur.prices;
      } else {
        accumulator.push({ ...cur });
      }
      return accumulator;
    }, []);
    combineCartOrders.forEach((cartOrder) => productId.push(cartOrder.product_id));
    let error = 0;
    const updateQuantityProducts = [];
    const getDataProducts = await ordersModel.checkProducts(productId);
    if (productId.length === getDataProducts.length) {
      combineCartOrders.forEach((value, index) => {
        updateQuantityProducts.push(getDataProducts[index].quantity - value.quantity);
        if (value > getDataProducts[index].quantity) {
          error += 1;
        }
      });
      if (error === 0) {
        const orderDetails = [];
        req.body.order.forEach((value) => {
          orderDetails.push({
            product_id: value.product_id,
            order_id: null,
            color_id: value.color_id,
            quantity: value.quantity,
            price: value.prices,
            created_at: new Date(),
            updated_at: new Date(),
          });
        });
        const addressId = await addressesModel.getPrimaryAddress(req.userLogin.user_id);
        if (addressId.length < 1) {
          return helpers.responseError(res, 'Primary Adddress', 409, 'There is no main address in your account', []);
        }
        const Orders = {
          user_id: req.userLogin.user_id,
          address_id: addressId[0].address_id,
          invoice_number: uuidv4(),
          total_price: req.body.total,
          payment: req.body.payment,
          status: 'submit',
          created_at: new Date(),
          updated_at: new Date(),
        };
        const addDataOrder = await ordersModel.insertOrder(Orders);
        orderDetails.forEach((orderDetail) => {
          orderDetail.order_id = addDataOrder.insertId;
        });
        const addDataOrderDetail = await ordersModel.insertOrderDetails(orderDetails);
        const updateDataProducts = await ordersModel.updateProducts(updateQuantityProducts, productId);
        const updateDataProductsAffectedRows = updateQuantityProducts.length > 1 ? updateDataProducts[0].affectedRows : updateDataProducts.affectedRows;
        if (addDataOrder.affectedRows && addDataOrderDetail.affectedRows && updateDataProductsAffectedRows) {
          helpers.response(res, 'success', 200, 'successfully added order data', []);
          productId.forEach((value) => clearRedisCache(`viewProductDetail/${value}`));
        }
      } else if (error > 0) {
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
    const checkExisOrder = await ordersModel.getUserOrder(req.params.id);
    if (checkExisOrder.length > 0) {
      if (req.body.status === 'cancel') {
        let orderDetails = await ordersModel.getOrderDetails(req.params.id);
        const productId = [];
        const updateQuantityProducts = [];
        orderDetails = orderDetails.reduce((accumulator, cur) => {
          const found = accumulator.find((elem) => elem.product_id === cur.product_id);
          if (found) {
            found.quantity += cur.quantity;
          } else {
            accumulator.push({ ...cur });
          }
          return accumulator;
        }, []);
        orderDetails.forEach((cancelOrder) => productId.push(cancelOrder.product_id));
        const getDataProducts = await ordersModel.checkProducts(productId);
        orderDetails.forEach((value, index) => {
          updateQuantityProducts.push(getDataProducts[index].quantity + value.quantity);
        });
        const updateDataProducts = await ordersModel.updateProducts(updateQuantityProducts, productId);
        if (updateDataProducts.affectedRows) {
          productId.forEach((value) => clearRedisCacheV2(`viewProductDetail/${value}`));
        }
      }
      const changeDataOrder = await ordersModel.updateOrder(data, req.params.id);
      if (changeDataOrder.affectedRows) {
        helpers.response(res, 'success', 200, 'successfully updated order status', []);
      } else {
        helpers.response(res, 'failed', 404, 'the data you want to change does not exist', []);
      }
    } else {
      helpers.response(res, 'failed', 404, "The order id doesn't exist", []);
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
      const address = await addressesModel.checkExistAddress(userOrder[0].address_id, 'address_id');
      res.json({
        store_id: userOrder[0].store_id,
        user_id: userOrder[0].user_id,
        name: userOrder[0].name,
        order_id: userOrder[0].order_id,
        invoice_number: userOrder[0].invoice_number,
        payment: userOrder[0].payment,
        total_price: userOrder[0].total_price,
        status: userOrder[0].status,
        created_at: userOrder[0].created_at,
        updated_at: userOrder[0].updated_at,
        products: [...orderDetails],
        address: { ...address[0] },
      });
    } else {
      helpers.response(res, 'failed', 404, "The order id doesn't exist", []);
    }
  } catch (error) {
    next(error);
  }
};

const readOrder = async (req, res, next) => {
  const status = req.query.status || '';
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
    const lengthRecord = Object.keys(
      await ordersModel.readOrder(req.userLogin.user_id, status, search, order, fieldOrder),
    ).length;
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
      dataOrders = await ordersModel.readOrder(req.userLogin.user_id, status, search, order, fieldOrder, start, limit);
      helpers.responsePagination(res, 'success', 200, 'data categories', dataOrders, pagination);
    } else {
      dataOrders = await ordersModel.readOrder(req.userLogin.user_id, status, search, order, fieldOrder);
      helpers.response(res, 'success', 200, 'data categories', dataOrders);
    }
  } catch (error) {
    next(error);
  }
};

const readOrderStore = async (req, res, next) => {
  const status = req.query.status || '';
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
    const storeId = await storesModel.checkExistStore(req.userLogin.user_id, 'user_id');
    if (storeId.length < 1) {
      return helpers.response(res, 'success', 200, 'order store', []);
    }
    let dataOrders;
    let pagination;
    const lengthRecord = Object.keys(
      await ordersModel.readOrderStore(storeId[0].store_id, status, search, order, fieldOrder),
    ).length;
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
      dataOrders = await ordersModel.readOrderStore(storeId[0].store_id, status, search, order, fieldOrder, start, limit);
      helpers.responsePagination(res, 'success', 200, 'order store', dataOrders, pagination);
    } else {
      dataOrders = await ordersModel.readOrderStore(storeId[0].store_id, status, search, order, fieldOrder);
      helpers.response(res, 'success', 200, 'order store', dataOrders);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  insertOrder,
  updateOrderStatus,
  viewOrderDetail,
  readOrder,
  readOrderStore,
};
