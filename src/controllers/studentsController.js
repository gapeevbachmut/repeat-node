// src/controllers/studentsController.js

import { Student } from '../models/student.js';
import createHttpError from 'http-errors';

export const getStudents = async (req, res) => {
  const {
    // вказую параметри пагінації
    page = 1,
    perPage = 5,
    //додаю параметри для фільтрації
    minAge,
    maxAge,
    gender,
    minAvgMark,
    //параметри для пошуку
    search,
    // сортування - вказуємо параметри
    // дефолтне сортування за id
    sortBy = '_id',
    sortOrder = 'asc',
  } = req.query;

  const skip = (page - 1) * perPage;

  // базовий запит до колекції
  // const studentsQuery = Student.find();
  // Додаємо критерій пошуку тільки студентів поточного користувача
  const studentsQuery = Student.find({ userId: req.user._id });

  // Пошук по частині імені // текстовий пошук
  if (search) {
    studentsQuery.where({
      name: { $regex: search, $options: 'i' },
      // regex шукає підрядки, але на великих коллекціях він дуже повільний
      // спробувати - Atlas Search
    });
  }
  /** // текстовий пошук через text index - повне співпадіння
  if (search) {
    studentsQuery.where({
      $text: { $search: search },
    });
  }*/

  // Будуємо фільтр

  if (minAge !== undefined) {
    studentsQuery.where('age').gte(minAge);
  }
  if (maxAge !== undefined) {
    studentsQuery.where('age').lte(maxAge);
  }

  if (gender !== undefined) {
    studentsQuery.where('gender').equals(gender);
  }

  if (minAvgMark !== undefined) {
    studentsQuery.where('avgMark').gte(minAvgMark);
  }

  //-//-//-//-//-//-//
  //виконуємо два запити паралельно
  // тут вказуємо параметри для пагінації + сортування
  const [totalItems, students] = await Promise.all([
    studentsQuery.clone().countDocuments(),
    // .countDocuments() — підраховує загальну кількість студентів у колекції.
    studentsQuery
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
    students,
  });
};

// отримати студента по ID

export const getStudentById = async (req, res) => {
  const { studentId } = req.params;

  // const student = await Student.findById(studentId);
  const student = await Student.findOne({
    _id: studentId,
    userId: req.user._id,
  });

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }
  res.status(200).json(student);
};

export const createStudent = async (req, res) => {
  const student = await Student.create({
    ...req.body,
    userId: req.user._id, //вказуємо кому належить цей студент
  });
  res.status(201).json(student);
};

export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;
  // const student = await Student.findOneAndDelete({    _id: studentId,  });
  const student = await Student.findOneAndDelete({
    _id: studentId,
    // Критерій пошуку по userId
    userId: req.user._id,
  });

  if (!student) {
    throw createHttpError(404, 'Student not found!');
  }
  res.status(200).json(student);
};

export const updateStudent = async (req, res) => {
  const { studentId } = req.params;
  // const student = await Student.findOneAndUpdate({ _id: studentId }, req.body, {    returnDocument: 'after',  });
  const student = await Student.findOneAndUpdate(
    // Критерій пошуку по userId
    { _id: studentId, userId: req.user._id },
    req.body,
    { returnDocument: 'after' },
  );
  if (!student) {
    throw createHttpError(404, 'Student not found!');
  }
  res.status(200).json(student);
};
