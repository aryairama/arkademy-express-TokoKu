const mailer = require('../configs/nodemailer');
const templateVerifEmail = require('../template/verifEmail');

const response = (res, status, statusCode, message, data) => {
  res.status(statusCode).json({
    status,
    statusCode,
    message,
    data,
  });
};
const responsePagination = (res, status, statusCode, message, data, pagination) => {
  res.status(statusCode).json({
    status,
    statusCode,
    message,
    data,
    pagination,
  });
};

const responseError = (res, status, statusCode, message, error) => {
  res.status(statusCode).json({
    status,
    statusCode,
    message,
    error,
  });
};

const promiseResolveReject = (resolve, reject, error, result) => {
  if (!error) {
    resolve(result);
  } else {
    reject(error);
  }
};

const sendVerifEmailRegister = async (token, emailTo, name) => {
  await mailer.sendMail({
    from: `"Ceo TokoKu" <${process.env.NODEMAILER_AUTH_USER}>`,
    to: emailTo,
    subject: 'Verify Email Address',
    html: templateVerifEmail(token, name),
  });
};

module.exports = {
  response,
  responseError,
  promiseResolveReject,
  responsePagination,
  sendVerifEmailRegister,
};
