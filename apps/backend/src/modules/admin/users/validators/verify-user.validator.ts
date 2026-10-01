import { celebrate, Joi, Segments } from "celebrate";

export default celebrate({
    [Segments.PARAMS]: Joi.object({
        id: Joi.string().uuid().required(),
    }),
});