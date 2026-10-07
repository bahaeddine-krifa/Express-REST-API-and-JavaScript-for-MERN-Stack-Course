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

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'The title field is mandatory.' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'The content field is mandatory.' });
    }

    const newArticle = new Article({
      title: title.trim(),
      author: typeof author === 'string' && author.trim() ? author.trim() : 'Anonymous',
      content: content.trim()
    });

    const savedArticle = await newArticle.save();
    res.status(201).json({
      message: 'Article created successfully!',
      article: savedArticle,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update article by ID
exports.updateArticle = async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const updateData = {};

    if (title !== undefined) {
      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }
      updateData.title = title.trim();
    }

    if (author !== undefined) {
      updateData.author = typeof author === 'string' && author.trim() ? author.trim() : 'Anonymous';
    }

    if (content !== undefined) {
      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Content cannot be empty' });
      }
      updateData.content = content.trim();
    }

    updateData.updatedAt = Date.now();

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
    res.status(400).json({ error: error.message });
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