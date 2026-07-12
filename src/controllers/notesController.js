import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found!');
  }
  res.status(200).json(
    note,
    // {    id: noteId,
    // message: `Retrieved note with ID: id_param. Отримано нотатку з ідентифікатором- ${noteId}`,
    // }
  );
};
