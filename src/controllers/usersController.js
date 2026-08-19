import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const getUsers = async (req, res) => {
  // вказую параметри пагінації
  const { page = 1, perPage = 5, search, minAge, maxAge, role } = req.query;
  const skip = (page - 1) * perPage;

  // базовий запит до колекції
  const usersQuery = User.find();

  // Пошук по частині імені
  if (search) {
    usersQuery.where({
      name: { $regex: search, $options: 'i' },
    });
  }

  // Будуємо фільтр
  if (minAge) {
    usersQuery.where('age').gte(minAge);
    // більше або дорівнює
  }

  if (maxAge) {
    usersQuery.where('age').lte(maxAge);
    // менше або дорівнює
  }

  if (role) {
    usersQuery.where('role').equals(role);
  }

  //виконуємо два запити паралельно
  const [totalItems, users] = await Promise.all([
    usersQuery.clone().countDocuments(),
    // .countDocuments() — підраховує загальну кількість студентів у колекції.
    usersQuery.skip(skip).limit(perPage),
    // .skip(skip).limit(perPage) — повертає тільки ту частину студентів, яка відповідає потрібній сторінці.
  ]);

  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    users,
  });
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  res.status(200).json(user);
};

export const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(200).json(user);
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOneAndDelete({
    _id: userId,
  });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  res.status(200).json(user);
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    returnDocument: 'after',
  });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  res.status(200).json(user);
};
