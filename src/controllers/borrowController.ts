import { Request, Response } from 'express';
import Borrow from '../models/borrowModel';
import Book from '../models/bookModel';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

export const borrowBook = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', error: errors.mapped() });
    }

    const { book: bookId, quantity, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found', error: 'Not found' });
    }

    if (book.copies < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough copies available', error: 'Insufficient copies' });
    }

    book.copies -= quantity;
    await book.updateAvailability();

    const borrow = new Borrow({ book: bookId, quantity, dueDate });
    await borrow.save();

    res.status(201).json({ success: true, message: 'Book borrowed successfully', data: borrow });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getBorrowedBooksSummary = async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book',
        },
      },
      { $unwind: '$book' },
      {
        $project: {
          book: {
            title: '$book.title',
            isbn: '$book.isbn',
          },
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, message: 'Borrowed books summary retrieved successfully', data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};