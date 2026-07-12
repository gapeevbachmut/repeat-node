import { Router } from 'express';

const router = Router();

router.post('/users', (req, res) => {
  console.log(req.body); // тепер тіло доступне як JS-об`єкт
  res.status(201).json({ message: 'User created' });
});

export default router;
