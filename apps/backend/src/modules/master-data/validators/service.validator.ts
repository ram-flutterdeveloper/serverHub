import { body } from "express-validator";

export const createServiceValidator = [
  body("categoryId")
    .notEmpty()
    .withMessage("Category is required"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Service name is required"),

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