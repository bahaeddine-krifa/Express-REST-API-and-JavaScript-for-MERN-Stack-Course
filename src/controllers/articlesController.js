const Article = require('../models/Article');

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ publishedAt: -1 });
    res.status(200).json({ total: articles.length, articles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// Get article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// Create new article
exports.createArticle = async (req, res) => {
  try {
    const { title, author = 'Anonymous', content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newArticle = new Article({
      title: title.trim(),
      author: typeof author === 'string' && author.trim() ? author.trim() : 'Anonymous',
      content: content.trim()
    });

    const savedArticle = await newArticle.save();
    res.status(201).json({
      message: 'Article created successfully!',
      article: savedArticle
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    // Handle duplicate key error (though we don't have unique fields on Article)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate key error' });
    }

    res.status(500).json({ error: 'Failed to create article' });
  }
};

// Update article by ID
exports.updateArticle = async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const updateData = {};

    if (title !== undefined) {
      updateData.title = title.trim();
    }

    if (author !== undefined) {
      updateData.author = typeof author === 'string' && author.trim() ? author.trim() : 'Anonymous';
    }

    if (content !== undefined) {
      updateData.content = content.trim();
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.status(200).json({
      message: 'Article updated successfully!',
      article: updatedArticle
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    res.status(500).json({ error: 'Failed to update article' });
  }
};

// Delete article by ID
exports.deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.status(200).json({
      message: 'Article deleted successfully!',
      article: deletedArticle
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
};

// Get my articles (protected)
exports.getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user._id });
    res.status(200).json({ total: articles.length, articles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};