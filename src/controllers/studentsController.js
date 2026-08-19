// src/controllers/studentsController.js

import { Student } from '../models/student.js';
import createHttpError from 'http-errors';

export const getStudents = async (req, res) => {
  // вказую параметри пагінації
  const {
    // для пагінації
    page = 1,
    perPage = 5,
    //додаю параметри для фільтрації
    minAge,
    maxAge,
    gender,
    minAvgMark,
    //параметри для пошуку
    search,
  } = req.query;

  const skip = (page - 1) * perPage;

  // базовий запит до колекції
  const studentsQuery = Student.find();

  // Пошук по частині імені
  if (search) {
    studentsQuery.where({
      name: { $regex: search, $options: 'i' },
    });
  }

  // Будуємо фільтр

  if (minAge) {
    studentsQuery.where('age').gte(minAge);
  }
  if (maxAge) {
    studentsQuery.where('age').lte(maxAge);
  }

  if (gender) {
    studentsQuery.where('gender').equals(gender);
  }

  if (minAvgMark) {
    studentsQuery.where('avgMark').gte(minAvgMark);
  }

  // текстовий пошук

  //-//-//-//-//-//-//
  //виконуємо два запити паралельно
  const [totalItems, students] = await Promise.all([
    studentsQuery.clone().countDocuments(),
    // .countDocuments() — підраховує загальну кількість студентів у колекції.
    studentsQuery.skip(skip).limit(perPage),
    // .skip(skip).limit(perPage) — повертає тільки ту частину студентів, яка відповідає потрібній сторінці.
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
  const student = await Student.findById(studentId);

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }
  res.status(200).json(student);
};

export const createStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
};

export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findOneAndDelete({
    _id: studentId,
  });
  if (!student) {
    throw createHttpError(404, 'Student not found!');
  }
  res.status(200).json(student);
};

export const updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findOneAndUpdate({ _id: studentId }, req.body, {
    returnDocument: 'after',
  });
  if (!student) {
    throw createHttpError(404, 'Student not found!');
  }
  res.status(200).json(student);
};
