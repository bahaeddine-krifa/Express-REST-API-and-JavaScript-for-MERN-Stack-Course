const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
      default: 'Anonymous'
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Index for faster sorting by publication date
articleSchema.index({ publishedAt: -1 });

// Virtual for excerpt (first 100 characters)
articleSchema.virtual('excerpt').get(function() {
  return this.content.substring(0, 100) + (this.content.length > 100 ? '...' : '');
});

// Ensure virtuals are included in JSON output
articleSchema.set('toJSON', { virtuals: true });
articleSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Article', articleSchema);