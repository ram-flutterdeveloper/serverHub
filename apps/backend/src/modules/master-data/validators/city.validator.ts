import { body } from "express-validator";

export const createCityValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("City name is required"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("country")
    .optional()
    .isString(),

  body("googlePlaceId")
    .optional()
    .isString(),

  body("latitude")
    .optional()
    .isFloat(),

  body("longitude")
    .optional()
    .isFloat(),

  body("sortOrder")
    .optional()
    .isInt(),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"]),
];