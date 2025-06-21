"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookController_1 = require("../controllers/bookController");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post('/', [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('author').notEmpty().withMessage('Author is required'),
    (0, express_validator_1.body)('genre')
        .isIn(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'])
        .withMessage('Invalid genre'),
    (0, express_validator_1.body)('isbn').notEmpty().withMessage('ISBN is required'),
    (0, express_validator_1.body)('copies').isInt({ min: 0 }).withMessage('Copies must be a positive number'),
], bookController_1.createBook);
router.get('/', bookController_1.getBooks);
router.get('/:bookId', bookController_1.getBookById);
router.put('/:bookId', [(0, express_validator_1.body)('copies').optional().isInt({ min: 0 }).withMessage('Copies must be a positive number')], bookController_1.updateBook);
router.delete('/:bookId', bookController_1.deleteBook);
exports.default = router;
