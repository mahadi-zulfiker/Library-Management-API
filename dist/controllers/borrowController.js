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
exports.getBorrowedBooksSummary = exports.borrowBook = void 0;
const borrowModel_1 = __importDefault(require("../models/borrowModel"));
const bookModel_1 = __importDefault(require("../models/bookModel"));
const express_validator_1 = require("express-validator");
const borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation failed', error: errors.mapped() });
        }
        const { book: bookId, quantity, dueDate } = req.body;
        const book = yield bookModel_1.default.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found', error: 'Not found' });
        }
        if (book.copies < quantity) {
            return res.status(400).json({ success: false, message: 'Not enough copies available', error: 'Insufficient copies' });
        }
        book.copies -= quantity;
        yield book.updateAvailability();
        const borrow = new borrowModel_1.default({ book: bookId, quantity, dueDate });
        yield borrow.save();
        res.status(201).json({ success: true, message: 'Book borrowed successfully', data: borrow });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});
exports.borrowBook = borrowBook;
const getBorrowedBooksSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});
exports.getBorrowedBooksSummary = getBorrowedBooksSummary;
