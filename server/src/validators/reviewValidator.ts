import { celebrate, Joi, Segments } from "celebrate";

export const validateReview = celebrate({
  [Segments.BODY]: Joi.object().keys({
    reviewData: Joi.object({
      doctor: Joi.string().length(24).required().messages({
        "any.required": "Doctor ID is required",
        "string.base": "Doctor ID must be a string",
        "string.empty": "Doctor ID cannot be empty",
      }),

      patient: Joi.string().length(24).required().messages({
        "any.required": "Patient ID is required",
        "string.base": "Patient ID must be a string",
        "string.empty": "Patient ID cannot be empty",
      }),

      rating: Joi.number().min(1).max(5).required().messages({
        "any.required": "Rating is required",
        "number.base": "Rating must be a number",
        "number.min": "Rating must be at least 1",
        "number.max": "Rating cannot be more than 5",
      }),

      comment: Joi.string().min(10).max(200).required().messages({
        "any.required": "Comment is required",
        "string.base": "Comment must be a string",
        "string.empty": "Comment cannot be empty",
        "string.min": "Comment must be at least 10 characters",
        "string.max": "Comment must be at most 200 characters",
      }),
    })
      .required()
      .messages({
        "any.required": "Review data is required",
        "object.base": "Review data must be an object",
      }),
  }),
});
