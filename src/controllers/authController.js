import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  //   спочатку шукаємо користувача з таким email.
  // Якщо він існує → повертаємо помилку 400 Bad Request з повідомленням Email in use.
  // Якщо ні →  створюємо користувача

  res.status(201).json({});
};
