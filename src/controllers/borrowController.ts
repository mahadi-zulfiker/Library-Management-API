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
          as: 'bookDetails',
        },
      },
      { $unwind: '$bookDetails' },
      {
        $project: {
          _id: 0,
          book: {
            _id: '$bookDetails._id',
            title: '$bookDetails.title',
            isbn: '$bookDetails.isbn',
          },
          totalQuantity: 1,
        },
      },
      { $sort: { "book.title": 1 } }
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
    if (book.copies === 0) {
        return res.status(400).json({
            success: false,
            message: 'This book is currently unavailable for borrowing.',
        });
    }

    const borrow = await Borrow.create({ book: bookId, quantity, dueDate });

    book.copies -= quantity;

    await book.save();

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: { borrow, updatedBook: book },
    });
  } catch (error) {
    next(error);
  }
};