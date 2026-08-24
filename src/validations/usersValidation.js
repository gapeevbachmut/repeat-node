// валідація моделі юзера

import { Joi, Segments } from 'celebrate';
import { objectIdValidator } from '../utils/objectIdValidator.js';
import { usersRole } from '../constants/constants.js';

// GET запит на отримання усієї колекції
export const getUserSchema = {
  [Segments.QUERY]: Joi.object({
    // додавання пагінації у запит get
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20),

    // текстовий пошук
    search: Joi.string().trim().allow(''),

    // додати параметри для фільтрації можна фідповідно до моделі
    // по кожному або по деяким!!!
    // name: Joi.string().trim(),
    minAge: Joi.number().positive().integer(),
    maxAge: Joi.number().positive().integer(),
    role: Joi.string().valid(...usersRole),

    // сортування
    sortBy: Joi.string()
      .valid('_id', 'name', 'age', 'role', 'createdAt', 'updatedAt')
      .default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
    /*
     sortBy → поле для сортування (_id, name, age, avgMark);
     sortOrder → напрямок (asc або desc), за замовчуванням "asc".
    */
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

export const updateUserSchema = {
  [Segments.PARAMS]: userIdSchema,
  [Segments.BODY]: bodySchema.min(1),
};
