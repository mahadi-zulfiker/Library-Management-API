import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import bookRoutes from './routes/bookRoutes';
import borrowRoutes from './routes/borrowRoutes';
import { errorHandler } from './middleware/errorHandler';
import cors from 'cors'; // Import cors

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors()); // Use cors middleware

connectDB();

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Library Management API is running. Use /api/books or /api/borrow endpoints.' });
});

app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));