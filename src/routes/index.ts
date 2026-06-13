import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import issuesRoutes from '../modules/issues/issues.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/issues', issuesRoutes);

export default router;