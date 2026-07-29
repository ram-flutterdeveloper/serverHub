import { body } from "express-validator";

export const providerDocumentValidator = [

    body("documentType")
        .isIn([
            "AADHAAR",
            "PAN",
            "GST",
            "SHOP_LICENSE",
            "DRIVING_LICENSE",
            "PASSPORT"
        ])
        .withMessage("Invalid document type"),

    body("documentNumber")
        .notEmpty()
        .withMessage("Document number is required"),

];