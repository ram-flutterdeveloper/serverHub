import { body } from "express-validator";

import validate from "../../../middlewares/validate";

export const createReviewValidator = [

  body("bookingId")

    .notEmpty()

    .withMessage(
      "Booking is required"
    )

    .isUUID()

    .withMessage(
      "Invalid booking id"
    ),

  body("rating")

    .notEmpty()

    .withMessage(
      "Rating is required"
    )

    .isInt({
      min: 1,
      max: 5,
    })

    .withMessage(
      "Rating must be between 1 and 5"
    ),

  body("review")

    .optional()

    .isString()

    .isLength({
      max: 1000,
    })

    .withMessage(
      "Review must be less than 1000 characters"
    ),

  body("images")

    .optional()

    .isArray()

    .withMessage(
      "Images must be an array"
    ),

  body("images.*")

    .optional()

    .isString()

    .withMessage(
      "Invalid image URL"
    ),

  validate,
];