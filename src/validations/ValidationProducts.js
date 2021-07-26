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

const isDuplicateArrayExist = (value) => {
  const duplicate = new Set(value).size !== value.length;
  if (duplicate) {
    throw new Error('duplicate color id');
  }
  return true;
};

const mimetypeImg = (value) => {
  if (Array.isArray(value)) {
    value.forEach((img) => {
      if (img.mimetype !== 'image/png' && img.mimetype !== 'image/jpeg') {
        throw new Error('img_product mmust be jpg or png');
      }
    });
  } else if (value.mimetype !== 'image/png' && value.mimetype !== 'image/jpeg') {
    throw new Error('img_product mmust be jpg or png');
  }
  return true;
};

const maxSizeImg = (value) => {
  if (Array.isArray(value)) {
    value.forEach((img) => {
      if (parseInt(img.size, 10) > 2097152) {
        throw new Error('image size exceeds 2 megabytes');
      }
    });
  } else if (parseInt(value.size, 10) > 2097152) {
    throw new Error('image size exceeds 2 megabytes');
  }
  return true;
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

const rulesCreateAndUpdate = () => [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage('name length between 3 to 255 characters'),
  body('brand')
    .notEmpty()
    .withMessage('brand is required')
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage('brand length between 3 to 255 characters'),
  body('price')
    .toInt()
    .isNumeric()
    .withMessage('price must be number')
    .bail()
    .isLength({ min: 1, max: 13 })
    .withMessage('price must be more than 0 and less than 13 digits')
    .isInt({ min: 1 })
    .withMessage('price must be more than 0'),
  body('size')
    .notEmpty()
    .withMessage('size product is required')
    .bail()
    .isIn(['XL', 'L', 'M', 'S', 'XS'])
    .withMessage('the value of the product size must be XL, L, M, S, XS'),
  body('quantity')
    .toInt()
    .isNumeric()
    .withMessage('quantity must be number')
    .bail()
    .isLength({ min: 1, max: 10 })
    .withMessage('quantity must be more than 0 and less than 10 digits'),
  body('product_status')
    .notEmpty()
    .withMessage('condition product is required')
    .bail()
    .isIn(['new', 'former'])
    .withMessage('the value of the condition of the product must be "new" or "former"'),
  body('description')
    .notEmpty()
    .withMessage('description is required')
    .bail()
    .isLength({ min: 10 })
    .withMessage('product description must be more than 10 characters'),
  body('category_id')
    .isNumeric()
    .withMessage('category id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('category id must be more than 0')
    .bail()
    .isLength({ min: 1, max: 10 })
    .withMessage('category id must be more than 0 and less than 10 digits'),
  body('colors')
    .if((value) => Array.isArray(value))
    .notEmpty()
    .withMessage('colors product is required')
    .bail()
    .isArray({ min: 1 })
    .withMessage('colors must be array and more than 0')
    .bail()
    .custom(isDuplicateArrayExist),
  body('colors')
    .if((value) => !Array.isArray(value))
    .notEmpty()
    .withMessage('colors product is required')
    .bail()
    .isNumeric()
    .withMessage('colors id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('colors id must be more than 0'),
  body('colors.*')
    .isNumeric()
    .withMessage('colors id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('colors id must be more than 0')
    .toInt(),
];

const rulesFileUploud = (req, res, next) => {
  if (req.files) {
    if (req.files.img_product) {
      if (Array.isArray(req.files.img_product)) {
        req.files.img_product.forEach((img) => delete img.data);
        req.body.img_product = [...req.files.img_product];
      } else {
        delete req.files.img_product.data;
        req.body.img_product = { ...req.files.img_product };
      }
    }
  }
  next();
};

const rulesCreateImgProduct = () => [
  body('img_product')
    .notEmpty()
    .withMessage('img_product is required')
    .bail()
    .custom(mimetypeImg)
    .bail()
    .custom(maxSizeImg),
];

const rulesUpdateImgProduct = () => [
  body('img_product')
    .optional({ nullable: true })
    .custom(mimetypeImg)
    .bail()
    .custom(maxSizeImg),
];

const rulesUpdateOldImg = () => [
  body('old_img_product')
    .if((value) => Array.isArray(value))
    .notEmpty()
    .withMessage('old img product product is required')
    .bail()
    .isArray({ min: 1 })
    .withMessage('old img product must be array and more than 0')
    .bail()
    .custom(isDuplicateArrayExist),
  body('old_img_product')
    .if((value) => !Array.isArray(value))
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('old_img_product id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('old_img_product id must be more than 0'),
  body('old_img_product.*')
    .isNumeric()
    .withMessage('old_img_product id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('old_img_product id must be more than 0')
    .toInt(),
];

const rulesUpdateAndDelete = () => [
  param('id')
    .isNumeric()
    .withMessage('id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('id must be more than 0'),
];

const validate = (method) => {
  if (method === 'read') {
    return [rulesRead(), validateResult];
  }
  if (method === 'create') {
    return [rulesFileUploud, rulesCreateImgProduct(), rulesCreateAndUpdate(), validateResult];
  }
  if (method === 'update') {
    return [
      rulesFileUploud,
      rulesUpdateAndDelete(),
      rulesUpdateImgProduct(),
      rulesCreateAndUpdate(),
      rulesUpdateOldImg(),
      validateResult,
    ];
  }
  if (method === 'delete') {
    return [rulesUpdateAndDelete(), validateResult];
  }
  return false;
};

export default validate;
