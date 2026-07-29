import { body } from "express-validator";

export const updateProfileValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required"),

  body("email")
    .isEmail()
    .withMessage("Invalid email"),

  body("gender")
    .isIn(["MALE", "FEMALE", "OTHER"])
    .withMessage("Invalid gender"),
];