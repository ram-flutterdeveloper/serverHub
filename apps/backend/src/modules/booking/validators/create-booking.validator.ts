import { body } from "express-validator";
import validate from "../../../middlewares/validate";

export const createBookingValidator = [

  body("packageId")
    .notEmpty()
    .withMessage("Package is required")
    .isUUID()
    .withMessage("Invalid package id"),

  body("addressId")
    .notEmpty()
    .withMessage("Address is required")
    .isUUID()
    .withMessage("Invalid address id"),

  body("bookingDate")
    .notEmpty()
    .withMessage("Booking date is required")
    .isISO8601()
    .withMessage("Invalid booking date"),

  body("timeSlotId")
    .notEmpty()
    .withMessage("Time slot is required")
    .isUUID()
    .withMessage("Invalid time slot id"),

  body("paymentMethod")
    .optional()
    .isIn(["COD", "ONLINE"])
    .withMessage(
      "Payment method must be COD or ONLINE"
    ),

  body("notes")
    .optional()
    .isString()
    .isLength({
      max: 500,
    })
    .withMessage(
      "Notes must be less than 500 characters"
    ),

  validate,
];