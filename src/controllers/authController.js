import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  const { name, email, password, age, avatar } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }
  //   спочатку шукаємо користувача з таким email.
  // Якщо він існує → повертаємо помилку 400 Bad Request з повідомленням Email in use.
  // Якщо ні →  створюємо користувача

  // Хешуємо пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створюємо користувача

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    age,
    avatar,
  });

  res.status(201).json({ newUser });
};
