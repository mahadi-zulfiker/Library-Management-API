import express from 'express';
import { createBook, getBooks, getBookById, updateBook, deleteBook } from '../controllers/bookController';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('genre')
      .isIn(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'])
      .withMessage('Invalid genre'),
    body('isbn').notEmpty().withMessage('ISBN is required'),
    body('copies').isInt({ min: 0 }).withMessage('Copies must be a positive number'),
  ],
  createBook
);
router.get('/', getBooks);
router.get('/:bookId', getBookById);
router.put(
  '/:bookId',
  [body('copies').optional().isInt({ min: 0 }).withMessage('Copies must be a positive number')],
  updateBook
);
router.delete('/:bookId', deleteBook);

export default router;