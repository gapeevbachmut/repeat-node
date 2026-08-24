import { Schema, model } from 'mongoose';
import { noteTags } from '../constants/constants.js';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
      default: '',
    },
    tag: {
      type: String,
      required: false,
      default: 'Todo',
      enum: noteTags,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**не треба створювати індекс на кожне поле тільки тому, що по ньому є фільтр. */
export const Note = model('Note', noteSchema);
