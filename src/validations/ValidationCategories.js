import {
  query, body, param, validationResult,
} from 'express-validator';

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

const rulesCreateAndUpdate = () => [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage('name length between 3 to 255 characters'),
];

const rulesUpdateAndDelete = () => [
  param('id')
    .isNumeric()
    .withMessage('id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('id must be more than 0'),
];

const rulesFileUploud = (req, res, next) => {
  if (req.files) {
    if (req.files.img_category) {
      delete req.files.img_category.data;
      req.body.img_category = { ...req.files.img_category };
    }
  }
  next();
};

const rulesCreateImgCategory = () => [
  body('img_category')
    .notEmpty()
    .withMessage('img category is required')
    .bail()
    .custom((value) => {
      if (value.mimetype !== 'image/png' && value.mimetype !== 'image/jpeg') {
        throw new Error('imgProduct must be jpg or png');
      }
      return true;
    })
    .bail()
    .custom((value) => {
      if (parseInt(value.size, 10) > 2097152) {
        throw new Error('image size exceeds 2 megabytes');
      }
      return true;
    }),
];

const rulesUpdateImgCategory = () => [
  body('img_category')
    .optional({ nullable: true })
    .custom((value) => {
      if (value.mimetype !== 'image/png' && value.mimetype !== 'image/jpeg') {
        throw new Error('img category must be jpg or png');
      }
      return true;
    })
    .bail()
    .custom((value) => {
      if (parseInt(value.size, 10) > 2097152) {
        throw new Error('image size exceeds 2 megabytes');
      }
      return true;
    }),
];

const validate = (method) => {
  if (method === 'read') {
    return [rulesRead(), validateResult];
  } if (method === 'create') {
    return [rulesFileUploud, rulesCreateImgCategory(), rulesCreateAndUpdate(), validateResult];
  } if (method === 'update') {
    return [rulesFileUploud, rulesUpdateImgCategory(), rulesUpdateAndDelete(), rulesCreateAndUpdate(), validateResult];
  } if (method === 'delete') {
    return [rulesUpdateAndDelete(), validateResult];
  }
  return false;
};

export default validate;
