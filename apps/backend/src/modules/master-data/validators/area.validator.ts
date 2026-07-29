import { body } from "express-validator";

export const createAreaValidator = [
  body("cityId")
    .notEmpty()
    .withMessage("City is required"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Area name is required"),

  body("googlePlaceId")
    .optional()
    .isString(),

  body("latitude")
    .optional()
    .isFloat(),

  body("longitude")
    .optional()
    .isFloat(),

  body("pincode")
    .optional()
    .isString(),

  body("sortOrder")
    .optional()
    .isInt(),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"]),
];