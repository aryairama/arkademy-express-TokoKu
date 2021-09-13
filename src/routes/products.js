const express = require('express');
const ControllerProduct = require('../controllers/ControllerProducts');
const ValidationProducts = require('../validations/ValidationProducts');
const { Auth, Role } = require('../middlewares/Auth');
const { hitCacheAllProduct, hitCacheProductDetail, hitCacheAllProductCategory } = require('../middlewares/Redis');

const router = express.Router();
router
  .get('/', ValidationProducts('read'), hitCacheAllProduct, ControllerProduct.readProduct)
  .post('/', Auth, Role('seller'), ValidationProducts('create'), ControllerProduct.insertProduct)
  .get('/:id', ValidationProducts('delete'), hitCacheProductDetail, ControllerProduct.viewProductDetail)
  .get('/category/:id', ValidationProducts('delete'), hitCacheAllProductCategory, ControllerProduct.readProductCategory)
  .put('/:id', Auth, Role('seller'), ValidationProducts('update'), ControllerProduct.updateProduct)
  .delete('/:id', Auth, Role('seller'), ValidationProducts('delete'), ControllerProduct.deleteProduct);

module.exports = router;
