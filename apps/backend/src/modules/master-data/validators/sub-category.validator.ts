import { body } from "express-validator";

export const createSubCategoryValidator = [
  body("serviceId")
    .notEmpty()
    .withMessage("Service is required"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Sub Category name is required"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("sortOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sort order must be a positive integer"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be true or false"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Invalid status"),
];