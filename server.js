const express = require('express');
const mongoose = require('mongoose');
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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mernblog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const articlesRoutes = require('./routes/articles');
const usersRoutes = require('./routes/users');

// Use routes
app.use('/api/articles', articlesRoutes);
app.use('/api/users', usersRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).send('<h1>MERN Blog API is operational</h1>');
});

// About endpoint
app.get('/about', (req, res) => {
  res.status(200).json({
    application: 'MERN Blog API',
    course: 'MERN Stack Course - Week 2: MongoDB & MVC Structure',
    version: '1.0.0',
  });
});

// Contact endpoint
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