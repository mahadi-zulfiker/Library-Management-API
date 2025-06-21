import mongoose, { Schema, Document } from 'mongoose';
import { IBorrow } from '../interfaces/types';

const borrowSchema = new Schema<IBorrow>({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be a positive number'],
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` timestamp
borrowSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IBorrow>('Borrow', borrowSchema);