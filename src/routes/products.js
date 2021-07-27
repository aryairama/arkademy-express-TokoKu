import express from 'express';
import ControllerProduct from '../controllers/ControllerProducts.js';
import ValidationProducts from '../validations/ValidationProducts.js';
import Auth from '../middlewares/Auth.js';
import Redis from '../middlewares/Redis.js';

const router = express.Router();
router
  .get('/', ValidationProducts('read'), Redis.hitCacheAllProduct, ControllerProduct.readProduct)
  .post('/', Auth, ValidationProducts('create'), ControllerProduct.insertProduct)
  .get('/:id', ValidationProducts('delete'), Redis.hitCacheProductDetail, ControllerProduct.viewProductDetail)
  .get('/category/:id', ValidationProducts('delete'), Redis.hitCacheAllProductCategory, ControllerProduct.readProductCategory)
  .put('/:id', Auth, ValidationProducts('update'), ControllerProduct.updateProduct)
  .delete('/:id', Auth, ValidationProducts('delete'), ControllerProduct.deleteProduct);

export default router;
