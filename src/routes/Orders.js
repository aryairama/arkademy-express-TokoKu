const express = require('express');
const ControllerOrders = require('../controllers/ControllerOrders');
const valdationOrders = require('../validations/ValidationOrders');
const { Auth, Role } = require('../middlewares/Auth');

const router = express.Router();

router
  .post('/', Auth, Role('seller', 'custommer'), ControllerOrders.insertOrder)
  .get('/', Auth, Role('seller', 'custommer'), valdationOrders('read'), ControllerOrders.readOrder)
  .patch('/:id', Auth, Role('seller', 'custommer'), valdationOrders('update'), ControllerOrders.updateOrderStatus)
  .get('/orderstore', Auth, Role('seller'), valdationOrders('read'), ControllerOrders.readOrderStore)
  .get('/detail/:id', Auth, Role('seller', 'custommer'), valdationOrders('view'), ControllerOrders.viewOrderDetail);

module.exports = router;
