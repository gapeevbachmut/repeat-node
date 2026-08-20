import { model, Schema } from 'mongoose';
import { usersRole } from '../constants/constants.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    age: {
      type: Number,
      required: false,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: usersRole,
    },
    password: { type: String, required: false },
    avatar: { type: String, required: false, trim: true },
  },
  {
    timestamps: true,
  },
);

// Унікальний email тільки для документів,
// у яких email присутній
userSchema.index({ email: 1 }, { unique: true, sparse: true });

// Індекси у MongoDB для пошуку - усі властивості по яких шукаємо/ фільтруємо
// Індекс для фільтрації за віком та роллю
userSchema.index({ age: 1 });
/**не треба створювати індекс на кожне поле тільки тому, що по ньому є фільтр. */

export const User = model('User', userSchema);
