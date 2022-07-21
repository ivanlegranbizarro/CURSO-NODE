import express from 'express';
import dotenv from 'dotenv';
import productRouter from './routes/products.js';
import userRouter from './routes/user.js';
import categoryRouter from './routes/category.js';
import orderRouter from './routes/orders.js';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from './helpers/jwt.js';
import errorHandler from './helpers/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.options('*', cors());

app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

// JSON body parser
app.use(express.json());

// authMiddleware
app.use(jwt());
app.use(errorHandler);

// Routing
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/orders', orderRouter);

// Server connection and database
const port = process.env.PORT || 3000;

try {
  mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to MongoDB')
  );
} catch (error) {
  console.log(error);
}

app.listen(port, () =>
  console.log(`The Server is running http://localhost:${port}`)
);
