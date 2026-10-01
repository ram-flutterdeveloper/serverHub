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

export const updateCityValidator = [
  body("name")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Name must be a valid string"),

  body("state")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("State must be a valid string"),

  body("country")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Country must be a valid string"),

  body("googlePlaceId")
    .optional({ nullable: true })
    .isString()
    .withMessage("googlePlaceId must be a string"),

  body("latitude")
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage(
      "latitude must be between -90 and 90"
    ),

  body("longitude")
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage(
      "longitude must be between -180 and 180"
    ),

  body("image")
    .optional({ nullable: true })
    .isString(),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage(
      "status must be ACTIVE or INACTIVE"
    ),

  body("sortOrder")
    .optional()
    .isInt()
    .withMessage(
      "sortOrder must be an integer"
    ),
];