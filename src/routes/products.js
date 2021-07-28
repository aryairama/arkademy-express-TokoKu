import express from 'express';
import ControllerProduct from '../controllers/ControllerProducts.js';
import ValidationProducts from '../validations/ValidationProducts.js';
import { Auth, Role } from '../middlewares/Auth.js';
import { hitCacheAllProduct, hitCacheProductDetail, hitCacheAllProductCategory } from '../middlewares/Redis.js';

const router = express.Router();
router
  .get('/', ValidationProducts('read'), hitCacheAllProduct, ControllerProduct.readProduct)
  .post('/', Auth, Role('seller'), ValidationProducts('create'), ControllerProduct.insertProduct)
  .get('/:id', ValidationProducts('delete'), hitCacheProductDetail, ControllerProduct.viewProductDetail)
  .get('/category/:id', ValidationProducts('delete'), hitCacheAllProductCategory, ControllerProduct.readProductCategory)
  .put('/:id', Auth, Role('seller'), ValidationProducts('update'), ControllerProduct.updateProduct)
  .delete('/:id', Auth, Role('seller'), ValidationProducts('delete'), ControllerProduct.deleteProduct);

export default router;
