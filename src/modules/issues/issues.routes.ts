import express from 'express';
import { asyncHandler } from '../../middleware/error.middleware.js';
import { verifyTokenMiddleware } from '../../middleware/auth.middleware.js';
import { checkRole } from '../../middleware/role.middleware.js';
import {
  createIssueHandler,
  deleteIssueHandler,
  getAllIssuesHandler,
  getIssueByIdHandler,
  updateIssueHandler,
} from './issues.controller.js';

const router = express.Router();

router.get('/', asyncHandler(getAllIssuesHandler));
router.get('/:id', asyncHandler(getIssueByIdHandler));
router.post('/', verifyTokenMiddleware, asyncHandler(createIssueHandler));
router.patch(
  '/:id',
  verifyTokenMiddleware,
  checkRole('contributor', 'maintainer'),
  asyncHandler(updateIssueHandler)
);
router.delete(
  '/:id',
  verifyTokenMiddleware,
  checkRole('maintainer'),
  asyncHandler(deleteIssueHandler)
);

export default router;