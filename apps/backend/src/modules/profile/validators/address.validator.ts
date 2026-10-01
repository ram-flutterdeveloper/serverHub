import { body } from "express-validator";
import validate from "../../../middlewares/validate";

export const createAddressValidator = [

  body("cityId")
    .isUUID()
    .withMessage("City is required"),

  body("areaId")
    .isUUID()
    .withMessage("Area is required"),

  body("houseNo")
    .notEmpty()
    .withMessage("House number is required"),

  body("addressLine")
    .notEmpty()
    .withMessage("Address is required"),

  body("contactPerson")
    .notEmpty()
    .withMessage("Contact person is required"),

  body("contactNumber")
    .notEmpty()
    .withMessage("Contact number is required"),

  validate,

];

export const updateAddressValidator =
  createAddressValidator;