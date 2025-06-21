import { Request, Response } from 'express';
import Book from '../models/bookModel';
import { validationResult } from 'express-validator';

export const createBook = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', error: errors.mapped() });
    }

    const book = new Book(req.body);
    await book.save();
    res.status(201).json({ success: true, message: 'Book created successfully', data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const { filter, sortBy = 'createdAt', sort = 'desc', limit = 10 } = req.query;
    const query: any = {};
    if (filter) query.genre = filter;

    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === 'asc' ? 1 : -1 })
      .limit(Number(limit));

    res.status(200).json({ success: true, message: 'Books retrieved successfully', data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found', error: 'Not found' });
    }
    res.status(200).json({ success: true, message: 'Book retrieved successfully', data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', error: errors.mapped() });
    }

    const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found', error: 'Not found' });
    }

    await book.updateAvailability();
    res.status(200).json({ success: true, message: 'Book updated successfully', data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found', error: 'Not found' });
    }
    res.status(200).json({ success: true, message: 'Book deleted successfully', data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};