import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/usersController.js';
import { celebrate } from 'celebrate';
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
  userIdParamSchema,
} from '../validations/usersValidation.js';

const router = Router();

router.get('/users', celebrate(getUserSchema), getUsers);
router.get('/users/:userId', celebrate(userIdParamSchema), getUserById);
router.post('/users', celebrate(createUserSchema), createUser);
router.delete('/users/:userId', celebrate(userIdParamSchema), deleteUser);
router.patch('/users/:userId', celebrate(updateUserSchema), updateUser);

export default router;
