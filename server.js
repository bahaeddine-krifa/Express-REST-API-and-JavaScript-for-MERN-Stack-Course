const express = require('express');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies before route handlers access req.body.
app.use(express.json());

// Log each request and pass it to the next middleware or route.
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// In-memory data for the Week 1 demonstrations; it resets when the server restarts.
const articles = [
  { id: 1, title: 'Introduction to MERN Stack', author: 'Admin' },
  { id: 2, title: 'Mastering Asynchronous Node.js', author: 'Admin' },
];

const users = [
  { id: 1, name: 'Youssef', email: 'youssef@example.com', role: 'student' },
  { id: 2, name: 'Aya', email: 'aya@example.com', role: 'student' },
  { id: 3, name: 'Karim', email: 'karim@example.com', role: 'student' },
];

app.get('/', (req, res) => {
  res.status(200).send('<h1>MERN Blog API is operational</h1>');
});

app.get('/about', (req, res) => {
  res.status(200).json({
    application: 'MERN Blog API',
    course: 'MERN Stack Course - Week 1: Back-End Foundations & Modern JavaScript',
    version: '1.0.0',
  });
});

app.get('/api/articles', (req, res) => {
  res.status(200).json({ total: articles.length, articles });
});

app.post('/api/articles', (req, res) => {
  const { title, author = 'Anonymous' } = req.body ?? {};

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'The title field is mandatory.' });
  }

  const newArticle = {
    id: Date.now(),
    title: title.trim(),
    author: typeof author === 'string' && author.trim() ? author.trim() : 'Anonymous',
  };
  articles.push(newArticle);

  return res.status(201).json({
    message: 'Article created successfully!',
    article: newArticle,
  });
});

app.get('/api/users', (req, res) => {
  res.status(200).json({ total: users.length, users });
});

app.post('/contact', (req, res) => {
  const { email, message } = req.body ?? {};

  if (typeof email !== 'string' || !email.trim() || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Both email and message are required.' });
  }

  return res.status(200).json({
    message: 'Your contact message was received successfully.',
    contact: { email: email.trim(), message: message.trim() },
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
