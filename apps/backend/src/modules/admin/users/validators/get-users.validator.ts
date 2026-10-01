import { celebrate, Joi, Segments } from "celebrate";

export default celebrate({
    [Segments.QUERY]: Joi.object({
        page: Joi.number().integer().min(1).default(1),

        limit: Joi.number().integer().min(1).max(100).default(10),

        search: Joi.string().allow("", null),

        status: Joi.string()
            .valid("ACTIVE", "BLOCKED", "PENDING", "DELETED")
            .optional(),

        from: Joi.date().optional(),

        to: Joi.date().optional(),
    }),
});