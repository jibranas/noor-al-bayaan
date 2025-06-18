import mongoose from 'mongoose';

const flashCardSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  arabicText: {
    type: String,
    required: true,
  },
  englishText: {
    type: String,
    required: true,
  },
  audioUrl: {
    type: String,
    required: false, // Making it optional in case not all cards have audio initially
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt timestamp before saving
flashCardSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const FlashCard = mongoose.models.FlashCard || mongoose.model('FlashCard', flashCardSchema); 