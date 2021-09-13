const express = require('express');
const ControllerStores = require('../controllers/ControllerStores');
const ValidationStores = require('../validations/ValidationStores');
const { Auth, Role } = require('../middlewares/Auth');

const router = express.Router();
router
  .get('/product', Auth, Role('seller'), ValidationStores('read'), ControllerStores.storeProducts)
  .get('/detail', Auth, Role('seller'), ControllerStores.viewDetailStore)
  .post('/update', Auth, Role('seller'), ValidationStores('update'), ControllerStores.updateProfileStore);

module.exports = router;
