import { celebrate, Joi, Segments } from 'celebrate';

export const signupValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.string()
            .pattern(/^\+?[1-9]\d{1,14}$/)
            .required(),
            dateOfBirth: Joi.string()
            .pattern(/^\d{2}-\d{2}-\d{4}$/) 
            .required(),
        gender: Joi.string().valid('male', 'female').required(),
        address: Joi.object({
            city: Joi.string().required(),
            landmark: Joi.string().optional(),
            pincode: Joi.string().pattern(/^\d{6}$/).required(),
            state: Joi.string().required(),
            street: Joi.string().required(),
        }).optional(),
        profilePicture: Joi.string().optional() 
    }),
});

