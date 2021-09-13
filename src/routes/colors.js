const express = require('express');
const ControllerColors = require('../controllers/ControllerColors');
const ValidationColors = require('../validations/ValidationColors');

const router = express.Router();

router.get('/', ValidationColors('read'), ControllerColors.readColor);

module.exports = router;
