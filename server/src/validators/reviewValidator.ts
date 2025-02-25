import { celebrate, Joi, Segments } from "celebrate";

export const validateReview = celebrate({
  [Segments.BODY]: Joi.object().keys({
    doctor: Joi.string().required(),
    patient: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(10).max(200).required(),
  }),
});
