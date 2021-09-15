const express = require('express');
const ControllerAddresses = require('../controllers/ControllerAddresses');
const ValidationAddresses = require('../validations/ValidationAddresses');
const { Auth, Role } = require('../middlewares/Auth');

const router = express.Router();

router.post('/', Auth, Role('custommer', 'seller'), ValidationAddresses('create'), ControllerAddresses.insertAddress);

module.exports = router;
