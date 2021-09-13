const {
  body, param, query, validationResult,
} = require('express-validator');
const helpers = require('../helpers/helpers');

const validateResult = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    next();
  } else {
    helpers.responseError(res, 'error', 422, 'Invalid input', error.array());
  }
};

const isDuplicateArrayExist = (value) => {
  const duplicate = new Set(value).size !== value.length;
  if (duplicate) {
    throw new Error('duplicate product id');
  }
  return true;
};

const rulesCreate = () => [
  body('user_id')
    .notEmpty()
    .withMessage('user id is required')
    .bail()
    .isNumeric()
    .withMessage('user id must be number')
    .isInt({ min: 1 })
    .withMessage('user id must be more than 0'),
  body('product_id')
    .notEmpty()
    .withMessage('product id is required')
    .bail()
    .isArray({ min: 1 })
    .withMessage('product id must be array and more than 0')
    .custom(isDuplicateArrayExist),
  body('product_id.*')
    .isInt({ min: 1 })
    .withMessage('product id must be more than 0')
    .bail()
    .isNumeric()
    .withMessage('product id must be number'),
  body('quantity')
    .notEmpty()
    .withMessage('quantity is required')
    .bail()
    .isArray({ min: 1 })
    .withMessage('quantity must be array and more than 0'),
  body('quantity.*')
    .isInt({ min: 1 })
    .withMessage('quantity must be more than 0')
    .bail()
    .isNumeric()
    .withMessage('quantity must be number'),
];

const rulesUpdateView = () => [
  param('id')
    .isNumeric()
    .withMessage('id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('id must be more than 0'),
];

const rulesUpdate = () => [
  body('status')
    .notEmpty()
    .withMessage('status order is required')
    .bail()
    .isIn(['submit', 'cancel', 'processed', 'sent', 'completed', 'paid'])
    .withMessage('the value of the status must be submit,cancel,processed,sent,completed and,paid'),
];

const rulesRead = () => [
  query('limit')
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('limit must be number')
    .bail()
    .isFloat({ min: 1 })
    .withMessage('limit must be more than 0'),
  query('page')
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('page must be number')
    .bail()
    .isFloat({ min: 1 })
    .withMessage('page must be more than 0'),
  query('fieldOrder')
    .optional({ nullable: true })
    .notEmpty()
    .withMessage('fieldOrder is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('fieldOrder must be more than 0'),
];

const validate = (method) => {
  if (method === 'create') {
    return [rulesCreate(), validateResult];
  }
  if (method === 'update') {
    return [rulesUpdateView(), rulesUpdate(), validateResult];
  }
  if (method === 'view') {
    return [rulesUpdateView(), validateResult];
  }
  if (method === 'read') {
    return [rulesRead(), validateResult];
  }
  return false;
};

module.exports = validate;
