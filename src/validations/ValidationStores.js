import { query, body, validationResult } from 'express-validator';
import userModel from '../models/users.js';

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
];

const rulesCreateUpdate = () => [
  body('store_name')
    .notEmpty()
    .withMessage('store name is required')
    .bail()
    .isLength({ min: 5, max: 255 })
    .withMessage('store name length between 5 to 255'),
  body('phone_number')
    .notEmpty()
    .withMessage('phone number is required')
    .bail()
    .isNumeric()
    .withMessage('phone number must be number')
    .bail()
    .isLength({ min: 10, max: 15 })
    .withMessage('phone number must be more than 10 and less than 15 digits'),
  body('store_description')
    .notEmpty()
    .withMessage('store description is required')
    .bail()
    .isLength({ min: 10 })
    .withMessage('store description must be more than 10 characters'),
];

const rulesUpdateEmail = () => [
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('The email you entered is not correct')
    .bail()
    .custom(async (value) => {
      const existingEmail = await userModel.checkExistUser(value, 'email');
      if (existingEmail.length > 0) {
        throw new Error('e-mail already registered');
      }
      return true;
    })
    .normalizeEmail(),
];

const rulesUpdateImgUser = () => [
  body('avatar')
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (value.mimetype !== 'image/png' && value.mimetype !== 'image/jpeg') {
        throw new Error('avatar mmust be jpg or png');
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

const rulesFileUploud = (req, res, next) => {
  if (req.files) {
    if (req.files.avatar) {
      delete req.files.avatar.data;
      req.body.avatar = { ...req.files.avatar };
    }
  }
  next();
};

const validate = (method) => {
  if (method === 'read') {
    return [rulesRead(), validateResult];
  }
  if (method === 'update') {
    return [rulesFileUploud, rulesUpdateImgUser(), rulesCreateUpdate(), rulesUpdateEmail(), validateResult];
  }
  return false;
};

export default validate;
