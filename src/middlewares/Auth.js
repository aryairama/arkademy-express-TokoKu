import Jwt from 'jsonwebtoken';
import helpers from '../helpers/helpers.js';

const Auth = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return helpers.responseError(res, 'Authorized failed', 401, 'Server need accessToken', []);
    }
    const token = accessToken.split(' ')[1];
    Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return helpers.responseError(res, 'Authorized failed', 401, 'token expired', []);
        } if (err.name === 'JsonWebTokenError') {
          return helpers.responseError(res, 'Authorized failed', 401, 'token invalid', []);
        }
        return helpers.responseError(res, 'Authorized failed', 401, 'token not active', []);
      }
      req.userLogin = decode;
      next();
    });
  } catch (error) {
    next(error);
  }
};

export default Auth;
