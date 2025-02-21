import { celebrate, Joi, Segments } from "celebrate";

export const validateSpecialization = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(4).max(15).required(),
    description: Joi.string().min(30).required(),
    note: Joi.string().required(),
    fee: Joi.number().required(),
  }),
});
