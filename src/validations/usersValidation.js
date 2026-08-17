// валідація моделі юзера

import { Joi, Segments } from 'celebrate';
import { objectIdValidator } from '../utils/objectIdValidator.js';

// додавання пагінації у запит get
export const getUserSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20),
  }),
};
// валідація моделі usera
const bodySchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string(),
  age: Joi.number().integer().min(12).max(65).required().messages({
    // 12 років - 65 років
    'number.base': 'Age must be a number',
    'number.min': 'Age must be at least {#limit}',
    'number.max': 'Age must be at most {#limit}',
    'any.required': 'Age is required',
  }),
  role: Joi.string().valid('guest', 'user', 'admin').required().messages({
    'any.only': 'Role must be one of:guest, user, admin',
    'any.required': 'Role is required',
  }),
  password: Joi.string(),
  awatar: Joi.string(),
});

export const createUserSchema = { [Segments.BODY]: bodySchema };

// Схема для перевірки параметра userId
const userIdSchema = Joi.object({
  userId: Joi.string().custom(objectIdValidator).required(),
});

export const userIdParamSchema = {
  [Segments.PARAMS]: userIdSchema,
};

// оновлення юзера
const bodyShemaUpdateUser = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string(),
  age: Joi.number().integer().min(12).max(65),
  role: Joi.string().valid('guest', 'user', 'admin'),
  password: Joi.string(),
  awatar: Joi.string(),
});

export const updateUserSchema = {
  [Segments.PARAMS]: userIdSchema,
  [Segments.BODY]: bodyShemaUpdateUser.min(1),
};
