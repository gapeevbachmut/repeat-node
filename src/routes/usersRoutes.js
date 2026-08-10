import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/usersController.js';
import { celebrate } from 'celebrate';
import { createUserSchema } from '../validations/usersValidation.js';

const router = Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', celebrate(createUserSchema), createUser);
router.delete('/users/:userId', deleteUser);
router.patch('/users/:userId', updateUser);

export default router;
