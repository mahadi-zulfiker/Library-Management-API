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
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getBooks = exports.createBook = void 0;
const bookModel_1 = __importDefault(require("../models/bookModel"));
const express_validator_1 = require("express-validator");
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation failed', error: errors.mapped() });
        }
        const book = new bookModel_1.default(req.body);
        yield book.save();
        res.status(201).json({ success: true, message: 'Book created successfully', data: book });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});
exports.createBook = createBook;
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = 'createdAt', sort = 'desc', limit = 10 } = req.query;
        const query = {};
        if (filter)
            query.genre = filter;
        const books = yield bookModel_1.default.find(query)
            .sort({ [sortBy]: sort === 'asc' ? 1 : -1 })
            .limit(Number(limit));
        res.status(200).json({ success: true, message: 'Books retrieved successfully', data: books });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});
exports.getBooks = getBooks;
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield bookModel_1.default.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found', error: 'Not found' });
        }
        res.status(200).json({ success: true, message: 'Book retrieved successfully', data: book });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});
exports.getBookById = getBookById;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation failed', error: errors.mapped() });
        }
        const book = yield bookModel_1.default.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found', error: 'Not found' });
        }
        yield book.updateAvailability();
        res.status(200).json({ success: true, message: 'Book updated successfully', data: book });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield bookModel_1.default.findByIdAndDelete(req.params.bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found', error: 'Not found' });
        }
        res.status(200).json({ success: true, message: 'Book deleted successfully', data: null });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});
exports.deleteBook = deleteBook;
