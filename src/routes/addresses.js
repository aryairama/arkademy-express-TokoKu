const express = require('express');
const ControllerAddresses = require('../controllers/ControllerAddresses');
const ValidationAddresses = require('../validations/ValidationAddresses');
const { Auth, Role } = require('../middlewares/Auth');

const router = express.Router();

router
  .post('/', Auth, Role('custommer', 'seller'), ValidationAddresses('create'), ControllerAddresses.insertAddress)
  .get('/', Auth, Role('custommer', 'seller'), ValidationAddresses('read'), ControllerAddresses.readAddress)
  .delete('/:id', Auth, Role('custommer', 'seller'), ValidationAddresses('delete'), ControllerAddresses.deleteAddress)
  .patch(
    '/primary/:id',
    Auth,
    Role('custommer', 'seller'),
    ValidationAddresses('setPrimary'),
    ControllerAddresses.setPrimaryAddress,
  );

module.exports = router;
