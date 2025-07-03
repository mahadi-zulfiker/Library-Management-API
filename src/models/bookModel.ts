// src/models/bookModel.ts (Ensure this logic is present)
import mongoose, { Schema, Document } from 'mongoose';
import { IBook } from '../interfaces/types'; // Assuming IBook is your interface

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
  available: { type: Boolean, default: true }, // Default to true
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update `updatedAt` timestamp and `available` status before saving
bookSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  this.available = this.copies > 0; // CRUCIAL: Ensure 'available' is derived from 'copies'
  next();
});

// Instance method (as per your original schema, though pre-save handles current logic)
bookSchema.methods.updateAvailability = async function () {
  this.available = this.copies > 0;
  await this.save();
};

export default mongoose.model<IBook>('Book', bookSchema);