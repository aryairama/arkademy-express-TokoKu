import express from 'express';
import ControllerProduct from '../controllers/ControllerProducts.js';
import ValidationProducts from '../validations/ValidationProducts.js';
import Auth from '../middlewares/Auth.js';

const router = express.Router();
router
  .get('/', ValidationProducts('read'), ControllerProduct.readProduct)
  .post('/', Auth, ValidationProducts('create'), ControllerProduct.insertProduct)
  .get('/:id', Auth, ValidationProducts('delete'), ControllerProduct.viewProductDetail)
  .get('/category/:id', ValidationProducts('delete'), ControllerProduct.readProductCategory)
  .put('/:id', Auth, ValidationProducts('update'), ControllerProduct.updateProduct)
  .delete('/:id', Auth, ValidationProducts('delete'), ControllerProduct.deleteProduct);

export default router;
