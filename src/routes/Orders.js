const express = require('express');
const ControllerOrders = require('../controllers/ControllerOrders');
const valdationOrders = require('../validations/ValidationOrders');
const { Auth, Role } = require('../middlewares/Auth');

const router = express.Router();

router
  .post('/', Auth, Role('seller', 'custommer'), ControllerOrders.insertOrder)
  .get('/', valdationOrders('read'), ControllerOrders.readOrder)
  .patch('/:id', valdationOrders('update'), ControllerOrders.updateOrderStatus)
  .get('/detail/:id', valdationOrders('view'), ControllerOrders.viewOrderDetail);

module.exports = router;
