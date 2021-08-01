import express from 'express';
import path from 'path';
import 'dotenv/config';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import usersRouter from './src/routes/users.js';
import productRouter from './src/routes/products.js';
import categoryRouter from './src/routes/category.js';
import ordersRouter from './src/routes/Orders.js';
import colorsRouter from './src/routes/colors.js';
import helpers from './src/helpers/helpers.js';

const app = express();
const port = process.env.PORT_APPLICATION;
app.use('/public', express.static(path.resolve('./public')));
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/orders', ordersRouter);
app.use('/colors', colorsRouter);
app.use('*', (req, res, next) => {
  next(new Error('Endpoint Not Found'));
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  helpers.responseError(res, 'Error', 500, err.message, []);
});
app.listen(port, () => {
  console.log(`server running port ${port}`);
});
