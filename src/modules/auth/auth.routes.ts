import express from 'express';
import { asyncHandler } from '../../middleware/error.middleware.js';
import { login, signup } from './auth.controller.js';

const router = express.Router();

router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));

export default router;