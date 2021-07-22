import {
  query, body, param, validationResult,
} from 'express-validator';
import fs from 'fs/promises';
// import multer from 'multer';
import path from 'path';
import helpers from '../helpers/helpers.js';
import userModel from '../models/users.js';
// import multerConfig from '../configs/multer.js';

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

// const validationUploudFile = (multerUploadFunction) => (req, res, next) => {
//   multerUploadFunction(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       res.status(500).json({
//         status: 'error',
//         statusCode: 500,
//         message: 'file uploud error',
//       });
//     } else if (err && err.name && err.name === 'Error') {
//       req.body.avatarError = err.message;
//     } else if (req.body.destinationAvatar === undefined && req.method === 'POST' && req.url === '/') {
//       req.body.avatarError = 'avatar is required';
//     }
//     next();
//   });
// };
const rulesFileUploud = (req, res, next) => {
  if (req.files) {
    if (req.files.avatar) {
      req.body.avatar = { ...req.files.avatar };
    }
  }
  next();
};

const rulesCreateImgUser = () => [
  body('avatar')
    .notEmpty()
    .withMessage('avatar is required')
    .bail()
    .custom((value) => {
      if (value.mimetype !== 'image/png' && value.mimetype !== 'image/jpeg') {
        throw new Error('imgProduct mmust be jpg or png');
      }
      return true;
    }),
];

const rulesUpdateImgUser = () => [
  body('avatar')
    .optional({ nullable: true })
    .custom((value) => {
      if (value.mimetype !== 'image/png' && value.mimetype !== 'image/jpeg') {
        throw new Error('avatar mmust be jpg or png');
      }
      return true;
    }),
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

const rulesCreateUpdate = () => [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .bail()
    .isLength({ min: 4, max: 225 })
    .withMessage('name length between 4 to 255'),
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
  body('roles')
    .notEmpty()
    .withMessage('roles is required')
    .bail()
    .isIn(['custommer', 'seller'])
    .withMessage('the value of the roles must be custommer or seller'),
  body('store_name')
    .if((value, { req }) => req.body.roles === 'seller')
    .notEmpty()
    .withMessage('store name is required')
    .bail()
    .isLength({ min: 5, max: 255 })
    .withMessage('store name length between 5 to 255'),
  body('store_description')
    .if((value, { req }) => req.body.roles === 'seller')
    .optional({ nullable: true })
    .isLength({ min: 10 })
    .withMessage('store description must be more than 10 characters'),
];
const rulesCustomEmail = () => [
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .bail()
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
const rulesReadUpdateDelete = () => [
  param('id')
    .isNumeric()
    .withMessage('id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('id must be more than 0'),
];

const rulesCreatePassword = () => [
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage('password length between 8 to 255'),
];

const rulesUpdatePassword = () => [
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
];

const rulesLogin = () => [
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage('The email you entered is not correct')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage('password length between 8 to 255'),
];

const validate = (method) => {
  if (method === 'create') {
    return [
      rulesFileUploud,
      rulesCreateImgUser(),
      rulesCustomEmail(),
      rulesCreateUpdate(),
      rulesCreatePassword(),
      validateResult,
    ];
  }
  if (method === 'read') {
    return [rulesRead(), validateResult];
  }
  if (method === 'delete') {
    return [rulesReadUpdateDelete(), validateResult];
  }
  if (method === 'update') {
    return [
      rulesFileUploud,
      rulesUpdateImgUser(),
      rulesReadUpdateDelete(),
      rulesCustomEmail(),
      rulesCreateUpdate(),
      rulesUpdatePassword(),
      validateResult,
    ];
  }
  if (method === 'login') {
    return [rulesLogin(), validateResult];
  }
  return false;
};
export default validate;
