import { Router } from 'express';

const router = Router();

router.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes - Отримано всі нотатки',
  });
});

router.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    id: noteId,
    message: `Retrieved note with ID: id_param. Отримано нотатку з ідентифікатором- ${noteId}`,
  });
});

export default router;
