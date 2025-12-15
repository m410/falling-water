import { Router } from 'express';
import { ReviewEndpoints } from './review.endpoints';
import { authenticateToken, authorizeRoles } from '../auth/auth';

export function createReviewRoutes(controller: ReviewEndpoints): Router {
  const router = Router();

  router.get('/', authenticateToken, authorizeRoles('user'), controller.findAll);
  router.get('/:id', authenticateToken, authorizeRoles('user'), controller.findById);
  router.post('/', authenticateToken, authorizeRoles('user'), controller.create);
  router.put('/:id', authenticateToken, authorizeRoles('user'), controller.update);
  router.delete('/:id', authenticateToken, authorizeRoles('user'), controller.delete);

  return router;
}
