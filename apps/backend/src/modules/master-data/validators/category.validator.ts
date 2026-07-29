import { body } from "express-validator";

export const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required"),

  body("description")
    .optional()
    .isString(),

  body("sortOrder")
    .optional()
    .isInt(),

  body("isFeatured")
    .optional()
    .isBoolean(),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"]),
];