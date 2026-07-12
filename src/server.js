// src/server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import studentsRoutes from './routes/studentsRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import usersRoutes from './routes/usersRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Глобальні middleware
app.use(logger); // 1. Логер першим — бачить усі запити
app.use(express.json()); // 2. Middleware для парсингу JSON
app.use(cors()); // 3. Дозволяє запити з будь-яких джерел
app.use(helmet()); // безпека

// Перший маршрут
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello - wWworld!' });
});

app.use(studentsRoutes);
app.use(notesRoutes);
app.use(usersRoutes);

/////////////////////////////////////

// 404 — якщо маршрут не знайдено
app.use(notFoundHandler);

// Error — якщо під час запиту виникла помилка
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
