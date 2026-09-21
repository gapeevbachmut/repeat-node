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
    // ждя зв'язку між моделями додамо -
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      //ref: "User" означає, що поле userId посилається на інший документ у колекції users
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// studentSchema.index({ name: 'text', userId: 1 });
// текстовий індекс для пошуку по name через $text
// Оновлюємо індекс полем userId, Тому що будемо використовувати його при пошуку

// Індекси у MongoDB для пошуку - усі властивості по яких шукаємо/ фільтруємо
/**не треба створювати індекс на кожне поле тільки тому, що по ньому є фільтр. */

export const Student = model('Student', studentSchema);
