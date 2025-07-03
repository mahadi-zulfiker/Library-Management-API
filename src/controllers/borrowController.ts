import { Request, Response, NextFunction } from 'express';
import Borrow from '../models/borrowModel';
import Book from '../models/bookModel';
// Assuming you have a utility for standardized responses, if not, I'll use res.status().json() directly.

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
          from: 'books', // Collection name for books
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
            _id: '$bookDetails._id', // Include book ID for frontend keying if needed
            title: '$bookDetails.title',
            isbn: '$bookDetails.isbn',
          },
          totalQuantity: 1,
        },
      },
      { $sort: { "book.title": 1 } } // Optional: Sort summary by book title
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
    if (book.copies === 0) { // Explicit check if already unavailable
        return res.status(400).json({
            success: false,
            message: 'This book is currently unavailable for borrowing.',
        });
    }

    const borrow = await Borrow.create({ book: bookId, quantity, dueDate });

    // Update book copies and availability
    book.copies -= quantity;
    // The pre-save hook in bookModel.ts should handle setting book.available based on copies
    // So, we just need to save the book.
    await book.save(); // This will trigger the pre-save hook to update 'available'

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: { borrow, updatedBook: book }, // Return updated book info for potential optimistic UI
    });
  } catch (error) {
    next(error);
  }
};

// NEW: Function to handle returning books
export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId, quantity } = req.body;

    if (!bookId || quantity === undefined || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book ID and a positive quantity are required for return.',
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Update book copies by adding the returned quantity
    book.copies += quantity;
    // The pre-save hook in bookModel.ts should handle setting book.available based on copies
    await book.save(); // This will trigger the pre-save hook to update 'available'

    // Optional: If you want to track individual returns, you'd update/delete
    // specific borrow records here. For this minimal system, we just update inventory.

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: { updatedBook: book }, // Return updated book info
    });
  } catch (error) {
    next(error);
  }
};