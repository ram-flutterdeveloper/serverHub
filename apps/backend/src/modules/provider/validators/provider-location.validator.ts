import { body } from "express-validator";

export const providerLocationValidator = [

    body("cityId")
        .notEmpty()
        .withMessage("City is required"),

    body("areaId")
        .notEmpty()
        .withMessage("Area is required"),

    body("addressLine1")
        .notEmpty()
        .withMessage("Address is required"),

    body("latitude")
        .isFloat()
        .withMessage("Latitude is required"),

    body("longitude")
        .isFloat()
        .withMessage("Longitude is required"),

    body("serviceRadius")
        .isInt({ min: 1, max: 100 })
        .withMessage("Service radius must be between 1 and 100 KM"),

    body("pincode")
        .notEmpty()
        .withMessage("Pincode is required"),

];