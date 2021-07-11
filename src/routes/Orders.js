import express from 'express';
import ControllerOrders from '../controllers/ControllerOrders.js';
import valdationOrders from '../validations/ValidationOrders.js';

const router = express.Router();

router
  .post('/', valdationOrders('create'), ControllerOrders.insertOrder)
  .get('/', valdationOrders('read'), ControllerOrders.readOrder)
  .patch('/:id', valdationOrders('update'), ControllerOrders.updateOrderStatus)
  .get('/detail/:id', valdationOrders('view'), ControllerOrders.viewOrderDetail);

export default router;
