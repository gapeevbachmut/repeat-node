// src/models/student.js

import { Schema, model } from 'mongoose';

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // прибирає пробіли на початку та в кінці
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    avgMark: {
      type: Number,
      required: true,
    },
    onDuty: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// studentSchema.index({ name: 'text' });
// текстовий індекс для пошуку по name через $text

// Індекси у MongoDB для пошуку - усі властивості по яких шукаємо/ фільтруємо
/**не треба створювати індекс на кожне поле тільки тому, що по ньому є фільтр. */

export const Student = model('Student', studentSchema);
