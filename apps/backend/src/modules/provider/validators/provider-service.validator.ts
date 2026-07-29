import { body } from "express-validator";

export const providerServiceValidator = [

    body("serviceId")
        .notEmpty()
        .isUUID()
        .withMessage("Valid serviceId is required"),

];