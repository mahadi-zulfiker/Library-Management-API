import express from 'express';
import { createBorrow, getBorrowedBooksSummary } from '../controllers/borrowController';
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

export default router;