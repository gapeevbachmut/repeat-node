import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getNotes = async (req, res) => {
  const {
    // вказую параметри пагінації
    page = 1,
    perPage = 5,
    //додаю параметри для фільтрації
    title,
    tag,
    //параметри для пошуку
    search,
    // сортування - вказуємо параметри
    // дефолтне сортування за id
    sortBy = '_id',
    sortOrder = 'asc',
  } = req.query;

  const skip = (page - 1) * perPage;

  // базовий запит до колекції
  const notesQuery = Note.find();

  // Пошук по частині content
  if (search) {
    notesQuery.where({
      content: { $regex: search, $options: 'i' },
    });
  }

  // Будуємо фільтр
  if (title) {
    notesQuery.where('title').regex(new RegExp(title, 'i'));
    //'i' означає ігнорувати регістр.
  }

  if (tag) {
    notesQuery.where('tag').equals(tag);
    // повне співпадіння
  }

  //виконуємо два запити паралельно
  // тут вказуємо параметри для пагінації + сортування

  const [totalItems, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    // .countDocuments() — підраховує загальну кількість студентів у колекції.
    notesQuery
      .skip(skip)
      .limit(perPage)
      // .skip(skip).limit(perPage) — повертає тільки ту частину студентів, яка відповідає потрібній сторінці.
      .sort({ [sortBy]: sortOrder }),
  ]);

  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    notes,
  });
};

// отримати note по ID

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found!');
  }
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });
  if (!note) {
    throw createHttpError(404, 'Note not found!');
  }
  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
    returnDocument: 'after',
  });
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};
