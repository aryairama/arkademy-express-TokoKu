import express from 'express';
import ControllerProduct from '../controllers/ControllerProducts.js';
import ValidationProducts from '../validations/ValidationProducts.js';
import Auth from '../middlewares/Auth.js';
import { hitCacheAllProduct, hitCacheProductDetail, hitCacheAllProductCategory } from '../middlewares/Redis.js';

const router = express.Router();
router
  .get('/', ValidationProducts('read'), hitCacheAllProduct, ControllerProduct.readProduct)
  .post('/', Auth, ValidationProducts('create'), ControllerProduct.insertProduct)
  .get('/:id', ValidationProducts('delete'), hitCacheProductDetail, ControllerProduct.viewProductDetail)
  .get('/category/:id', ValidationProducts('delete'), hitCacheAllProductCategory, ControllerProduct.readProductCategory)
  .put('/:id', Auth, ValidationProducts('update'), ControllerProduct.updateProduct)
  .delete('/:id', Auth, ValidationProducts('delete'), ControllerProduct.deleteProduct);

export default router;
