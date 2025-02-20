import { celebrate, Joi, Segments } from 'celebrate';

export const validateDoctor = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required(),
    gender: Joi.string().valid('male', 'female').required(),
    specialization: Joi.string().required(),
    specialties: Joi.array().items(Joi.string()).min(1).required(),
    languages: Joi.array().items(Joi.string()).min(1).required(),
    registerNo: Joi.string().required(),
    experience: Joi.number().integer().min(0).required(),
    biography: Joi.string().required(),
    availability: Joi.array()
      .items(
        Joi.object({
          day: Joi.string()
            .valid(
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday'
            )
            .required(),
          slots: Joi.array()
            .items(
              Joi.object({
                startTime: Joi.string().required(),
                endTime: Joi.string().required(),
                isBooked: Joi.boolean().required(),
              })
            )
            .required(),
        })
      )
      .optional(),
  }),
});
