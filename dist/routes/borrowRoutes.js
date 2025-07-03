"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const borrowController_1 = require("../controllers/borrowController"); // Import returnBook
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post('/', [
    (0, express_validator_1.body)('book').isMongoId().withMessage('Invalid book ID'),
    (0, express_validator_1.body)('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive number'),
    (0, express_validator_1.body)('dueDate').isISO8601().toDate().withMessage('Invalid due date'),
], borrowController_1.createBorrow);
router.get('/', borrowController_1.getBorrowedBooksSummary);
// // NEW: Route for returning books
// router.post(
//   '/return',
//   [
//     body('bookId').isMongoId().withMessage('Invalid book ID'),
//     body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive number'),
//   ],
//   returnBook
// );
exports.default = router;
