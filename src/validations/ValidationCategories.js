import { query, body, param, validationResult } from "express-validator";
const validateResult = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    next();
  } else {
    res.status(422).json({
      status: "error",
      statusCode: 422,
      message: "Invalid input",
      error: error.array(),
    });
  }
};

const rulesRead = () => {
  return [
    query("limit")
      .optional({ nullable: true })
      .isNumeric()
      .withMessage("limit must be number")
      .bail()
      .isFloat({ min: 1 })
      .withMessage("limit must be more than 0"),
    query("page")
      .optional({ nullable: true })
      .isNumeric()
      .withMessage("page must be number")
      .bail()
      .isFloat({ min: 1 })
      .withMessage("page must be more than 0"),
    query("fieldOrder")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("fieldOrder is required")
      .bail()
      .isLength({ min: 1 })
      .withMessage("fieldOrder must be more than 0"),
  ];
};

const rulesCreateAndUpdate = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .bail()
      .isLength({ min: 3, max: 255 })
      .withMessage("name length between 3 to 255 characters"),
  ];
}

const rulesUpdateAndDelete = () => {
  return [
    param("id")
      .isNumeric()
      .withMessage("id must be number")
      .bail()
      .isInt({ min: 1 })
      .withMessage("id must be more than 0"),
  ];
}
const validate = (method) => {
  if (method === "read") {
    return [rulesRead(),validateResult];
  } else if (method === "create") {
    return [rulesCreateAndUpdate(),validateResult]
  } else if (method === "update") {
    return [rulesUpdateAndDelete(),rulesCreateAndUpdate(),validateResult]
  } else if (method === "delete") {
    return [rulesUpdateAndDelete(),validateResult]
  }
};

export default validate;
