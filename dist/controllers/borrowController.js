"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnBook = exports.createBorrow = exports.getBorrowedBooksSummary = void 0;
const borrowModel_1 = __importDefault(require("../models/borrowModel"));
const bookModel_1 = __importDefault(require("../models/bookModel"));
// Assuming you have a utility for standardized responses, if not, I'll use res.status().json() directly.
const getBorrowedBooksSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrowModel_1.default.aggregate([
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
            { $sort: { "book.title": 1 } } // Optional: Sort summary by book title
        ]);
        res.status(200).json({
            success: true,
            message: 'Borrowed books summary retrieved successfully',
            data: summary,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getBorrowedBooksSummary = getBorrowedBooksSummary;
const createBorrow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book: bookId, quantity, dueDate } = req.body;
        const book = yield bookModel_1.default.findById(bookId);
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
        const borrow = yield borrowModel_1.default.create({ book: bookId, quantity, dueDate });
        // Update book copies and availability
        book.copies -= quantity;
        // The pre-save hook in bookModel.ts should handle setting book.available based on copies
        // So, we just need to save the book.
        yield book.save(); // This will trigger the pre-save hook to update 'available'
        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: { borrow, updatedBook: book }, // Return updated book info for potential optimistic UI
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createBorrow = createBorrow;
// NEW: Function to handle returning books
const returnBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId, quantity } = req.body;
        if (!bookId || quantity === undefined || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Book ID and a positive quantity are required for return.',
            });
        }
        const book = yield bookModel_1.default.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }
        // Update book copies by adding the returned quantity
        book.copies += quantity;
        // The pre-save hook in bookModel.ts should handle setting book.available based on copies
        yield book.save(); // This will trigger the pre-save hook to update 'available'
        // Optional: If you want to track individual returns, you'd update/delete
        // specific borrow records here. For this minimal system, we just update inventory.
        res.status(200).json({
            success: true,
            message: 'Book returned successfully',
            data: { updatedBook: book }, // Return updated book info
        });
    }
    catch (error) {
        next(error);
    }
});
exports.returnBook = returnBook;
