import { celebrate, Joi, Segments } from "celebrate";

export const validateApplicant = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required(),
    specialization: Joi.string().required(),
    languages: Joi.array().items(Joi.string()).min(1).required(),
    registerNo: Joi.string().required(),
    experience: Joi.number().integer().min(0).required(),
    workingTwoHrs: Joi.string().required(),
    licensedState: Joi.string().required(),
  }),
});
