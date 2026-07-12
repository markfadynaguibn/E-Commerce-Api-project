require('dotenv').config();

const express = require('express');
const mongoSanitize = require('mongo-sanitize');
const connectDB = require('./config/db');
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorHandler');

// Global Routes Imports References Declarations
const categoryRouter = require('./routes/category.routes');
const productRouter = require('./routes/product.routes');
const cartRouter = require('./routes/cart.routes');
const orderRouter = require('./routes/order.routes');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);
  next();
});

app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`The targeted route pipeline interface location '${req.originalUrl}' is not structured on this host environment runtime layout setup`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server executing safely in context [${process.env.NODE_ENV || 'development'}] mode mapping layer on logical operational port channel: ${PORT}`);
  });
};

startServer();