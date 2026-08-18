import { Joi, Segments } from 'celebrate';
import { objectIdValidator } from '../utils/objectIdValidator.js';

// додавання пагінації у запит get
export const getStudentsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20),

    // додати параметри для фільтрації можна фідповідно до моделі
    // по кожному або по деяким!!!
    name: Joi.string().trim(),
    minAge: Joi.number().positive().integer(),
    maxAge: Joi.number().positive().integer(),
    gender: Joi.string().valid('male', 'female', 'other'),
    minAvgMark: Joi.number().positive(),
  }),
};

// валідація моделі студента
const bodySchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'any.required': 'Name is required',
  }),
  age: Joi.number().integer().min(12).max(65).required().messages({
    // 12 років - 65 років
    'number.base': 'Age must be a number',
    'number.min': 'Age must be at least {#limit}',
    'number.max': 'Age must be at most {#limit}',
    'any.required': 'Age is required',
  }),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.only': 'Gender must be one of: male, female, or other',
    'any.required': 'Gender is required',
  }),
  avgMark: Joi.number().min(2).max(12).required().messages({
    'number.base': 'Average mark must be a number',
    'number.min': 'Average mark must be at least {#limit}',
    'number.max': 'Average mark must be at most {#limit}',
    'any.required': 'Average mark is required',
  }),
  onDuty: Joi.boolean().messages({
    'boolean.base': 'onDuty must be a boolean value',
  }),
});

export const createStudentSchema = { [Segments.BODY]: bodySchema };

// Схема для перевірки параметра studentId
const studenIdSchema = Joi.object({
  studentId: Joi.string().custom(objectIdValidator).required(),
});

export const studentIdParamSchema = {
  [Segments.PARAMS]: studenIdSchema,
};
// передаємо у роутер

// оновлення студента
const bodySchemaUpdateStudent = Joi.object({
  name: Joi.string().min(3).max(30),
  age: Joi.number().integer().min(12).max(65), // 12 років - 65 років
  gender: Joi.string().valid('male', 'female', 'other'),
  avgMark: Joi.number().min(2).max(12),
  onDuty: Joi.boolean(),
});

export const updateStudentSchema = {
  [Segments.PARAMS]: studenIdSchema,
  [Segments.BODY]: bodySchemaUpdateStudent.min(1), // важливо: не дозволяємо порожнє тіло
};
