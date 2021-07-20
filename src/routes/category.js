import express from 'express';
import ControllerCategories from '../controllers/ControllerCategories.js';
import ValidationCategories from '../validations/ValidationCategories.js';

const router = express.Router();
router
  .get('/', ValidationCategories('read'), ControllerCategories.readCategory)
  .post('/', ValidationCategories('create'), ControllerCategories.insertCategory)
  .get('/:id', ValidationCategories('delete'), ControllerCategories.viewCategoryDetail)
  .put('/:id', ValidationCategories('update'), ControllerCategories.updateCategory)
  .delete('/:id', ValidationCategories('delete'), ControllerCategories.deleteCategory);
export default router;
