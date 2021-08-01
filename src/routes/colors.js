import express from 'express';
import ControllerColors from '../controllers/ControllerColors.js';
import ValidationColors from '../validations/ValidationColors.js';

const router = express.Router();

router.get('/', ValidationColors('read'), ControllerColors.readColor);

export default router;
