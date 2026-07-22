import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
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
