import { Router } from 'express';
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from '../controllers/notesController.js';
import { celebrate } from 'celebrate';
import {
  createNoteSchema,
  noteIdParamSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

router.get('/notes', getNotes);
router.get('/notes/:noteId', celebrate(noteIdParamSchema), getNoteById);
router.post('/notes', celebrate(createNoteSchema), createNote);
router.delete('/notes/:noteId', celebrate(noteIdParamSchema), deleteNote);
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;
