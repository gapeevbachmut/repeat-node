import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const getUsers = async (req, res) => {
  const {
    // вказую параметри пагінації
    page = 1,
    perPage = 5,
    //параметри для пошуку
    search,
    //додаю параметри для фільтрації
    minAge,
    maxAge,
    role,
    // сортування - вказуємо параметри
    // дефолтне сортування за name
    sortBy = 'name',
    sortOrder = 'asc',
  } = req.query;
  const skip = (page - 1) * perPage;

  // базовий запит до колекції
  const usersQuery = User.find();

  // Пошук по частині імені/ пошти
  if (search) {
    usersQuery.where({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
      // regex шукає підрядки, але на великих коллекціях він дуже повільний
      // спробувати - Atlas Search
    });
  }

  // Будуємо фільтр
  if (minAge !== undefined) {
    usersQuery.where('age').gte(minAge);
    // більше або дорівнює
  }

  if (maxAge !== undefined) {
    usersQuery.where('age').lte(maxAge);
    // менше або дорівнює
  }

  if (role !== undefined) {
    usersQuery.where('role').equals(role);
  }

  //виконуємо два запити паралельно
  // тут вказуємо параметри для пагінації + сортування

  const [totalItems, users] = await Promise.all([
    usersQuery.clone().countDocuments(),
    // .countDocuments() — підраховує загальну кількість студентів у колекції.
    usersQuery
      .skip(skip)
      .limit(perPage)
      // .skip(skip).limit(perPage) — повертає тільки ту частину студентів, яка відповідає потрібній сторінці.
      // Додаємо сортування в ланцюжок методів квері
      .sort({ [sortBy]: sortOrder }),
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
  res.status(201).json(user);
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
