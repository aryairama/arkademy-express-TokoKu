import Redis from 'ioredis';
import helpers from '../helpers/helpers.js';

export const redis = new Redis({
  port: process.env.PORT_REDIS,
  host: process.env.HOST_REDIS,
  password: process.env.AUTH_REDIS,
  db: 0,
});

export const hitCacheAllProduct = (req, res, next) => {
  const search = req.query.search || '';
  let order = req.query.order || '';
  if (order.toUpperCase() === 'ASC') {
    order = 'ASC';
  } else if (order.toUpperCase() === 'DESC') {
    order = 'DESC';
  } else {
    order = 'DESC';
  }
  let { fieldOrder } = req.query;
  if (fieldOrder) {
    if (fieldOrder.toLowerCase() === 'name') {
      fieldOrder = 'name';
    } else if (fieldOrder.toLowerCase() === 'price') {
      fieldOrder = 'price';
    } else if (fieldOrder.toLowerCase() === 'quantity') {
      fieldOrder = 'quantity';
    } else {
      fieldOrder = 'product_id';
    }
  } else {
    fieldOrder = 'product_id';
  }
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  redis.get(`readProduct-${search}-${order}-${fieldOrder}-${limit}-${page}`, (error, result) => {
    if (result !== null) {
      const { data, pagination } = JSON.parse(result);
      helpers.responsePagination(res, 'success', 200, 'data products', data, pagination);
      console.log('redis cache readProduct');
    } else {
      console.log('no cache');
      next();
    }
  });
};

export const hitCacheProductDetail = (req, res, next) => {
  redis.get(`viewProductDetail/${req.params.id}`, (error, result) => {
    if (result !== null) {
      helpers.response(res, 'success', 200, 'detail product', JSON.parse(result));
      console.log('redis cache viewProductDetail');
    } else {
      console.log('no cache');
      next();
    }
  });
};

export const hitCacheAllProductCategory = (req, res, next) => {
  redis.get(`readProductCategory/${req.params.id}`, (error, result) => {
    if (result !== null) {
      helpers.response(res, 'success', 200, 'data products', JSON.parse(result));
      console.log('redis cache readProductCategory');
    } else {
      console.log('no cache');
      next();
    }
  });
};

export const clearRedisCache = (...patterns) => {
  patterns.forEach((pattern) => {
    redis.keys(pattern, (error, result) => {
      result.forEach((redisCache) => {
        redis.del(redisCache);
      });
    });
  });
};
