const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'admin', 'moderator'],
        message: '{VALUE} is not a valid role'
      },
      default: 'student'
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Instance method to get user profile (without sensitive data)
userSchema.methods.getProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static method to find users by role
userSchema.statics.findByRole = function(role) {
  return this.find({ role });
};

module.exports = mongoose.model('User', userSchema);