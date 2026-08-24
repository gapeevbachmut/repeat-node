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
      required: true,
      unique: true,
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
    password: { type: String, required: true },
    avatar: { type: String, required: false, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

//  якщо name — необов'язкове поле. За замовчуванням воно дорівнює email
// userSchema.pre('save', function () {
//   if (!this.name) {
//     this.name = this.email;
//   }
// });

// Видалення паролю з відповіді
// Перевизначаємо метод toJSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

/**не треба створювати індекс на кожне поле тільки тому, що по ньому є фільтр. */

export const User = model('User', userSchema);
