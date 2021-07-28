/* eslint-disable import/prefer-default-export */
import Jwt from 'jsonwebtoken';
import connecion from '../middlewares/Redis.js';

export const genAccessToken = (payload, option) => new Promise((resolve, reject) => {
  Jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { ...option }, (err, token) => {
    if (err) {
      console.log(err);
      reject(err);
    }
    resolve(token);
  });
});

export const genRefreshToken = (payload, option) => new Promise((resolve, reject) => {
  Jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { ...option }, (err, token) => {
    if (err) {
      console.log(err);
      reject(err);
    }
    connecion.redis.set(`jwtRefToken-${payload.user_id}`, token, 'EX', option.expiresIn);
    resolve(token);
  });
});
