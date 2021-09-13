const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const usersRouter = require('./src/routes/users');
const productRouter = require('./src/routes/products');
const categoryRouter = require('./src/routes/category');
const ordersRouter = require('./src/routes/Orders');
const colorsRouter = require('./src/routes/colors');
const storesRouter = require('./src/routes/stores');
const helpers = require('./src/helpers/helpers');

const app = express();
const port = process.env.PORT;
app.use('/public', express.static(path.resolve('./public')));
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/orders', ordersRouter);
app.use('/colors', colorsRouter);
app.use('/stores', storesRouter);
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
