const {
  body, query, param, validationResult,
} = require('express-validator');

const validateResult = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    next();
  } else {
    res.status(422).json({
      status: 'error',
      statusCode: 422,
      message: 'Invalid input',
      error: error.array(),
    });
  }
};

const rulesCreateAndUpdate = () => [
  // body('user_id')
  //   .notEmpty()
  //   .withMessage('user id is required')
  //   .bail()
  //   .isNumeric()
  //   .withMessage('user id must be number')
  //   .bail()
  //   .isInt({ min: 1 })
  //   .withMessage('user id must be more than 0')
  //   .bail()
  //   .isLength({ min: 1, max: 10 })
  //   .withMessage('user id must be more than 0 and less than 10 digits'),
  body('primary_address')
    .notEmpty()
    .withMessage('primary_address is required')
    .bail()
    .isIn(['0', '1'])
    .withMessage('the value of the primary_address must be "0" or "1"'),
  body('label')
    .notEmpty()
    .withMessage('label is required')
    .bail()
    .isLength({ min: 4, max: 225 })
    .withMessage('label length between 4 to 255'),
  body('recipients_name')
    .notEmpty()
    .withMessage('recipients_name is required')
    .bail()
    .isLength({ min: 4, max: 225 })
    .withMessage('recipients_name length between 4 to 255'),
  body('phone_number')
    .notEmpty()
    .withMessage('phone_number is required')
    .bail()
    .isNumeric()
    .withMessage('phone number must be number')
    .bail()
    .isLength({ min: 10, max: 15 })
    .withMessage('phone number must be more than 10 and less than 15 digits'),
  body('city_or_subdistrict')
    .notEmpty()
    .withMessage('city_or_subdistrict is required')
    .bail()
    .isLength({ min: 5 })
    .withMessage('city_or_subdistrict description must be more than 5 characters'),
  body('address')
    .notEmpty()
    .withMessage('address is required')
    .bail()
    .isLength({ min: 10 })
    .withMessage('address description must be more than 10 characters'),
  body('postal_code')
    .notEmpty()
    .withMessage('postal_code is required')
    .bail()
    .isNumeric()
    .withMessage('postal_code must be number')
    .bail()
    .isLength({ min: 5, max: 5 })
    .withMessage('postal_code must be cannot be more and less than 5 digits'),
];

const rulesRead = () => [
  query('limit')
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('limit must be number')
    .bail()
    .isFloat({ min: 1 })
    .withMessage('limit must be more than 0'),
  query('page')
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('page must be number')
    .bail()
    .isFloat({ min: 1 })
    .withMessage('page must be more than 0'),
  query('fieldOrder')
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage('fieldOrder is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('fieldOrder must be more than 0'),
];

const rulesReadUpdateDelete = () => [
  param('id')
    .isNumeric()
    .withMessage('id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('id must be more than 0'),
];

const validate = (method) => {
  if (method === 'create') {
    return [rulesCreateAndUpdate(), validateResult];
  }
  if (method === 'read') {
    return [rulesRead(), validateResult];
  }
  if (method === 'delete') {
    return [rulesReadUpdateDelete(), validateResult];
  }
};

module.exports = validate;
