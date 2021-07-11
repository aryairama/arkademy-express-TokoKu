import express from 'express';
import path from 'path';
import 'dotenv/config';
import cors from 'cors';
import usersRouter from './src/routes/users.js';
import productRouter from './src/routes/products.js';
import categoryRouter from './src/routes/category.js';
import ordersRouter from './src/routes/Orders.js';

const app = express();
const port = process.env.PORT_APPLICATION;
app.use('/public', express.static(path.resolve('./public')));
app.use(cors());
app.use(express.json());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'internal server error',
  });
});
app.use('/users', usersRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/orders', ordersRouter);
app.listen(port, () => {
  console.log(`server running port ${port}`);
});
