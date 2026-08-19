import { Schema, model } from 'mongoose';
import { noteTags } from '../constants/constants.js';

const noteScema = new Schema(
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

// Індекси у MongoDB для пошуку - усі властивості по яких шукаємо/ фільтруємо
noteScema.index({ title: 1, tag: 1 });

export const Note = model('Note', noteScema);
