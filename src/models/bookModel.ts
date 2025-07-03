import mongoose, { Schema, Document } from 'mongoose';
import { IBook } from '../interfaces/types';

const bookSchema = new Schema<IBook>({
  title: { type: String, required: [true, 'Title is required'] },
  author: { type: String, required: [true, 'Author is required'] },
  genre: {
    type: String,
    enum: {
      values: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
      message: '{VALUE} is not a valid genre',
    },
    required: [true, 'Genre is required'],
  },
  isbn: { type: String, required: [true, 'ISBN is required'], unique: true },
  description: { type: String },
  copies: { type: Number, required: [true, 'Copies is required'], min: [0, 'Copies must be a non-negative number'] },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

bookSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  this.available = this.copies > 0;
  next();
});

bookSchema.methods.updateAvailability = async function () {
  this.available = this.copies > 0;
  await this.save();
};

export default mongoose.model<IBook>('Book', bookSchema);