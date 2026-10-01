import { body } from "express-validator";
import validate from "../../../middlewares/validate";

export const bookingSummaryValidator = [

  body("packageId")
    .notEmpty()
    .withMessage("Package is required")
    .isUUID()
    .withMessage("Invalid package id"),

  validate,

];