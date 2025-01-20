import { celebrate, Joi, Segments } from 'celebrate';

export const validateSpecialization = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    note: Joi.string().required(),
    fee: Joi.number().required()
  }),
});
