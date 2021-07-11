import {
  query, body, param, validationResult,
} from 'express-validator';
import fs from 'fs/promises';
import multer from 'multer';
import path from 'path';
import helpers from '../helpers/helpers.js';
import multerConfig from '../configs/multer.js';

const validateResult = (req, res, next) => {
  let error = validationResult(req);
  if (error.isEmpty() && req.body.avatarError === undefined) {
    next();
  } else {
    if (req.body.destinationAvatar) {
      fs.unlink(path.join(path.dirname(''), `/${req.body.destinationAvatar}`));
    }
    if (req.body.avatarError) {
      error = [
        ...error.array(),
        {
          value: '',
          msg: req.body.avatarError,
          param: 'avatar',
          location: 'file',
        },
      ];
      helpers.responseError(res, 'error', 422, 'invalid input', error);
    } else {
      helpers.responseError(res, 'error', 422, 'invalid input', error.array());
    }
  }
};

const validationUploudFile = (multerUploadFunction) => (req, res, next) => {
  multerUploadFunction(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'file uploud error',
      });
    } else if (err && err.name && err.name === 'Error') {
      req.body.avatarError = err.message;
    } else if (
      req.body.destinationAvatar === undefined
        && req.url === '/register'
    ) {
      req.body.avatarError = 'avatar is required';
    }
    next();
  });
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

const rulesRegister = () => [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .bail()
    .isLength({ min: 4, max: 225 })
    .withMessage('name length between 4 to 255'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('The email you entered is not correct')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage('password length between 8 to 255'),
  body('phone_number')
    .isNumeric()
    .withMessage('phone number must be number')
    .bail()
    .isLength({ min: 10, max: 15 })
    .withMessage('phone number must be more than 10 and less than 15 digits'),
  body('gender')
    .notEmpty()
    .withMessage('gender is required')
    .bail()
    .isIn(['female', 'male'])
    .withMessage('the value of the gender must be female or male'),
  body('date_of_birth')
    .notEmpty()
    .withMessage('date of birth is required')
    .bail()
    .isDate()
    .withMessage('date of birth must be date'),
];

const rulesUpdate = () => [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .bail()
    .isLength({ min: 4, max: 225 })
    .withMessage('name length between 4 to 255'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('The email you entered is not correct')
    .normalizeEmail(),
  body('new_password')
    .optional({ nullable: true })
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage('new password length between 8 to 255'),
  body('old_password')
    .if(body('new_password').exists())
    .notEmpty()
    .withMessage('old password is required')
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage('old password length between 8 to 255'),
  body('phone_number')
    .isNumeric()
    .withMessage('phone number must be number')
    .bail()
    .isLength({ min: 10, max: 15 })
    .withMessage('phone number must be more than 10 and less than 15 digits'),
  body('gender')
    .notEmpty()
    .withMessage('gender is required')
    .bail()
    .isIn(['female', 'male'])
    .withMessage('the value of the gender must be female or male'),
  body('date_of_birth')
    .notEmpty()
    .withMessage('date of birth is required')
    .bail()
    .isDate()
    .withMessage('date of birth must be date'),
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
    return [
      validationUploudFile(multerConfig.uploudUserAvatar),
      rulesRegister(),
      validateResult,
    ];
  } if (method === 'read') {
    return [rulesRead(), validateResult];
  } if (method === 'delete') {
    return [rulesReadUpdateDelete(), validateResult];
  } if (method === 'update') {
    return [
      rulesReadUpdateDelete(),
      validationUploudFile(multerConfig.uploudUserAvatar),
      rulesUpdate(),
      validateResult,
    ];
  }
  return false;
};
export default validate;
