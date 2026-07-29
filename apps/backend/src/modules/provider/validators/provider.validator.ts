import { body } from "express-validator";

export const registerProviderValidator = [
  body("businessName")
    .notEmpty()
    .withMessage("Business name is required"),

  body("displayName")
    .notEmpty()
    .withMessage("Display name is required"),

  body("experienceYears")
    .isInt({ min: 0 })
    .withMessage("Invalid experience"),
];