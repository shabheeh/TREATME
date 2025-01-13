import { celebrate, Joi, Segments } from 'celebrate';


export const signinValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
});
