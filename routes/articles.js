const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');

// GET all articles
router.get('/', articlesController.getAllArticles);

// GET article by ID
router.get('/:id', articlesController.getArticleById);

// CREATE new article
router.post('/', articlesController.createArticle);

// UPDATE article by ID
router.put('/:id', articlesController.updateArticle);

// DELETE article by ID
router.delete('/:id', articlesController.deleteArticle);

module.exports = router;