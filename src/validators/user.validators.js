import Joi from 'joi';
import { validate } from '../middlewares/validator.middleware.js';

const createUserSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
});

export const createUserValidation = validate(createUserSchema, 'body');