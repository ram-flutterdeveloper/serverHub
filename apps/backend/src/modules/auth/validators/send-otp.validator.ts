import { body } from "express-validator";

export const sendOtpValidator = [
  body("mobile")
    .notEmpty()
    .withMessage("Mobile number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid mobile number"),
];