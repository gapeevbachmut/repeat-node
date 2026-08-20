import { Joi, Segments } from 'celebrate';
import { objectIdValidator } from '../utils/objectIdValidator.js';
import { noteTags } from '../constants/constants.js';

// GET запит на отримання усієї колекції

export const getNotesSchema = {
  [Segments.QUERY]: Joi.object({
    // додавання пагінації у запит get
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20),

    // текстовий пошук for content
    search: Joi.string().trim().allow(''),

    // додати параметри для фільтрації можна фідповідно до моделі
    // по кожному або по деяким!!!
    title: Joi.string().trim(),
    tag: Joi.string().valid(...noteTags),
    // ... розгортає масив з noteTags

    // сортування
    sortBy: Joi.string()
      .valid('_id', 'title', 'createdAt', 'updatedAt')
      .default('_id'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
    /*
     sortBy → поле для сортування (_id, .........);
     sortOrder → напрямок (asc або desc), за замовчуванням "asc".
    */
  }),
};

// валідація моделі нотатки
const bodySchema = Joi.object({
  title: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Title must be a string',
    'string.min': 'Title should have at least {#limit} characters',
    'string.max': 'Title should have at most {#limit} characters',
    'any.required': 'Title is required',
  }),
  content: Joi.string().messages({
    'string.base': 'Content must be a string and/or number',
  }),
  tag: Joi.string(),
});

export const createNoteSchema = { [Segments.BODY]: bodySchema };

// Схема для перевірки параметра noteId

const noteIdSchema = Joi.object({
  noteId: Joi.string().custom(objectIdValidator).required(),
});

export const noteIdParamSchema = { [Segments.PARAMS]: noteIdSchema };
// передаємо у роутер

// оновлення нотатки
const bodySchemaUpdateNote = Joi.object({
  title: Joi.string().min(3).max(30),
  content: Joi.string(),
  tag: Joi.string(),
});

export const updateNoteSchema = {
  [Segments.PARAMS]: noteIdSchema,
  [Segments.BODY]: bodySchemaUpdateNote.min(1),
};
