import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const registerSchema = Joi.object({
  name: Joi.string().required().max(100),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6)
}); 