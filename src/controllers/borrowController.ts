import { Request, Response, NextFunction } from 'express';
import Borrow from '../models/borrowModel';
import Book from '../models/bookModel';

export const getBorrowedBooksSummary = async (req: Request, res: Response, next: NextFunction) => {
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
          _id: 0,
          book: {
            title: '$book.title',
            isbn: '$book.isbn',
          },
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export const createBorrow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
    if (quantity > book.copies) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${quantity}) exceeds available copies (${book.copies})`,
      });
    }
    const borrow = await Borrow.create({ book: bookId, quantity, dueDate });
    book.copies -= quantity;
    if (book.copies === 0) {
      book.available = false;
    }
    await book.save();
    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrow,
    });
  } catch (error) {
    next(error);
  }
};