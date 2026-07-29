import { body } from "express-validator";

export const createPackageValidator = [
  body("subCategoryId")
    .notEmpty()
    .withMessage("Sub Category is required"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Package name is required"),

  body("defaultPrice")
    .isNumeric()
    .withMessage("Price is required"),

  body("durationMinutes")
    .isInt({ min: 1 })
    .withMessage("Duration is required"),
];