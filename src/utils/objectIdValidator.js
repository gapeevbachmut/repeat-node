import { isValidObjectId } from 'mongoose';

//
// Кастомний валідатор для ObjectId in mongoose

export const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};
