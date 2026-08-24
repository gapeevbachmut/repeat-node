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
    versionKey: false,
  },
);

// Унікальний email тільки для документів, у яких email присутній
// індекс для пошуку конкретного email
userSchema.index({ email: 1 }, { unique: true, sparse: true });

/**не треба створювати індекс на кожне поле тільки тому, що по ньому є фільтр. */

export const User = model('User', userSchema);
