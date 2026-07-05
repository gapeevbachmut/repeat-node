// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware для парсингу JSON
app.use(express.json());
app.use(cors()); // Дозволяє запити з будь-яких джерел
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

// Логування часу
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

// Перший маршрут
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello - world!' });
});

// GET-запит до маршруту "/health"
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'Ok!',
  });
});

// Маршрут для тестування middleware помилки
app.get('/test-error', (req, res) => {
  // Штучна помилка для прикладу
  throw new Error('Something went wrong');
});

app.post('/users', (req, res) => {
  console.log(req.body); // тепер тіло доступне як JS-об`єкт
  res.status(201).json({ message: 'User created' });
});

// Middleware 404 (після всіх маршрутів)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware для обробки помилок
// app.use((err, req, res, next) => {
//   console.error('Error:', err.message);
//   res.status(500).json({
//     message: 'Internal Server Error',
//     error: err.message,
//   });
// });

app.use((err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
