import express from 'express';
import ControllerProduct from '../controllers/ControllerProducts.js';
import ValidationProducts from '../validations/ValidationProducts.js';

const router = express.Router();
router
  .get('/', ValidationProducts('read'), ControllerProduct.readProduct)
  .post('/', ValidationProducts('create'), ControllerProduct.insertProduct)
  .get('/:id', ValidationProducts('delete'), ControllerProduct.viewProductDetail)
  .get('/category/:id', ValidationProducts('delete'), ControllerProduct.readProductCategory)
  .put('/:id', ValidationProducts('update'), ControllerProduct.updateProduct)
  .delete('/:id', ValidationProducts('delete'), ControllerProduct.deleteProduct);

export default router;
