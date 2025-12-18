import { Router } from 'express';
import { OrderEndpoints } from './order.endpoints';
import { authenticateToken, authorizeRoles } from '../auth/auth';

export function createOrderRoutes(controller: OrderEndpoints): Router {
  const router = Router();

  router.get('/', authenticateToken, authorizeRoles('user'), controller.findPage);
  router.get('/:id', authenticateToken, authorizeRoles('user'), controller.findById);
  router.post('/', authenticateToken, authorizeRoles('user'), controller.create);
  router.put('/:id', authenticateToken, authorizeRoles('user'), controller.update);
  router.delete('/:id', authenticateToken, authorizeRoles('user'), controller.delete);

  return router;
}
