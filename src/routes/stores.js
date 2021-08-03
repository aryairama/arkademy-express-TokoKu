import express from 'express';
import ControllerStores from '../controllers/ControllerStores.js';
import ValidationStores from '../validations/ValidationStores.js';
import { Auth, Role } from '../middlewares/Auth.js';

const router = express.Router();
router
  .get('/product', Auth, Role('seller'), ValidationStores('read'), ControllerStores.storeProducts)
  .get('/detail', Auth, Role('seller'), ControllerStores.viewDetailStore)
  .post('/update', Auth, Role('seller'), ValidationStores('update'), ControllerStores.updateProfileStore);

export default router;
