import { model, Schema } from 'mongoose';

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
      unique: true,
    },
    age: {
      type: Number,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: ['guest', 'user', 'admin'],
    },
    password: {},
    avatar: { type: String, required: false, trim: true },
  },
  {
    timestamps: true,
  },
);

// Індекси у MongoDB для пошуку - усі властивості по яких шукаємо/ фільтруємо
userSchema.index({ age: 1, role: 1 });

export const User = model('User', userSchema);
