import express from 'express';
import { createBorrow, getBorrowedBooksSummary, returnBook } from '../controllers/borrowController'; // Import returnBook
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/',
  [
    body('book').isMongoId().withMessage('Invalid book ID'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive number'),
    body('dueDate').isISO8601().toDate().withMessage('Invalid due date'),
  ],
  createBorrow
);
router.get('/', getBorrowedBooksSummary);

// // NEW: Route for returning books
// router.post(
//   '/return',
//   [
//     body('bookId').isMongoId().withMessage('Invalid book ID'),
//     body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive number'),
//   ],
//   returnBook
// );

export default router;