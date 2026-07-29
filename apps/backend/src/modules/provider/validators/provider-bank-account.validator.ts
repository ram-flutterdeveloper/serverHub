import { body } from "express-validator";

export const providerBankAccountValidator = [

    body("accountHolderName")
        .trim()
        .notEmpty()
        .withMessage("Account holder name is required"),

    body("bankName")
        .trim()
        .notEmpty()
        .withMessage("Bank name is required"),

    body("accountNumber")
        .trim()
        .notEmpty()
        .withMessage("Account number is required"),

    body("ifscCode")
        .trim()
        .notEmpty()
        .withMessage("IFSC code is required"),

    body("accountType")
        .optional()
        .isIn([
            "SAVINGS",
            "CURRENT"
        ]),

    body("upiId")
        .optional()
        .isString(),

    body("branchName")
        .optional()
        .isString(),

];