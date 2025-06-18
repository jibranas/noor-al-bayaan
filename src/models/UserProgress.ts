import mongoose, { Schema } from 'mongoose';

const cardResponseSchema = new Schema({
  flashcardId: {
    type: Schema.Types.ObjectId,
    ref: 'FlashCard',
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, { _id: false });

const userProgressSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  responses: [cardResponseSchema],
}, { timestamps: true });

// Update the 'updatedAt' timestamp for the subdocument when it's changed
userProgressSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update && update.$set && update.$set['responses.$.isCorrect'] !== undefined) {
    this.set('responses.$.updatedAt', new Date());
  }
  next();
});

export const UserProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', userProgressSchema); 