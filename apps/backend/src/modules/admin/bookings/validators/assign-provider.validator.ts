import { body, param } from "express-validator";

export const assignProviderValidator = [
  param("bookingId")
    .isUUID()
    .withMessage("Invalid booking id"),

  body("providerId")
    .isUUID()
    .withMessage("Invalid provider id"),
];