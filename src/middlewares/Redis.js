const Redis = require('ioredis');
const { response, responsePagination } = require('../helpers/helpers');

const redis = new Redis({
  path: process.env.PATH_REDIS,
  port: process.env.PORT_REDIS,
  host: process.env.HOST_REDIS,
  password: process.env.AUTH_REDIS,
  db: 0,
});

const hitCacheAllProduct = (req, res, next) => {
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
      responsePagination(res, 'success', 200, 'data products', data, pagination);
      console.log('redis cache readProduct');
    } else {
      console.log('no cache');
      next();
    }
  });
};

const hitCacheProductDetail = (req, res, next) => {
  redis.get(`viewProductDetail/${req.params.id}`, (error, result) => {
    if (result !== null) {
      response(res, 'success', 200, 'detail product', JSON.parse(result));
      console.log('redis cache viewProductDetail');
    } else {
      console.log('no cache');
      next();
    }
  });
};

const hitCacheAllProductCategory = (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  redis.get(`readProductCategory/${req.params.id}-${limit}-${page}`, (error, result) => {
    if (result !== null) {
      const { data, pagination } = JSON.parse(result);
      responsePagination(res, 'success', 200, 'data products', data, pagination);
      console.log('redis cache readProductCategory');
    } else {
      console.log('no cache');
      next();
    }
  });
};

const clearRedisCache = (...patterns) => {
  patterns.forEach((pattern) => {
    redis.keys(pattern, (error, result) => {
      result.forEach((redisCache) => {
        redis.del(redisCache);
      });
    });
  });
};

module.exports = {
  redis, hitCacheAllProduct, hitCacheAllProductCategory, hitCacheProductDetail, clearRedisCache,
};
