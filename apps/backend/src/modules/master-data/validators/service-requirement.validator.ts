import { body } from "express-validator";

export const createRequirementValidator = [

    body("packageId")
        .notEmpty(),

    body("label")
        .notEmpty(),

    body("fieldKey")
        .notEmpty(),

    body("fieldType")
        .isIn([
            "TEXT",
            "NUMBER",
            "SELECT",
            "MULTI_SELECT",
            "DATE",
            "TIME",
            "CHECKBOX"
        ])

];