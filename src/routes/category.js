const express = require('express');
const ControllerCategories = require('../controllers/ControllerCategories');
const ValidationCategories = require('../validations/ValidationCategories');

const router = express.Router();
router
  .get('/', ValidationCategories('read'), ControllerCategories.readCategory)
  .post('/', ValidationCategories('create'), ControllerCategories.insertCategory)
  .get('/:id', ValidationCategories('delete'), ControllerCategories.viewCategoryDetail)
  .put('/:id', ValidationCategories('update'), ControllerCategories.updateCategory)
  .delete('/:id', ValidationCategories('delete'), ControllerCategories.deleteCategory);

module.exports = router;
