import { body } from "express-validator";

export const providerWorkingHourValidator = [

    body("dayOfWeek")
        .isIn([
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY"
        ])
        .withMessage("Invalid day"),

    body("isOpen")
        .isBoolean()
        .withMessage("isOpen must be boolean"),

    body("openTime")
        .optional({ nullable: true })
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("openTime format should be HH:mm"),

    body("closeTime")
        .optional({ nullable: true })
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("closeTime format should be HH:mm"),
];