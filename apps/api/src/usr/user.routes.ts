import { Router } from 'express';
import { UserEndpoints } from './user.endpoints';
import { authenticateToken, authorizeRoles } from '../auth/auth';

export function createUserRoutes(controller: UserEndpoints): Router {
  const router = Router();

  router.get('/', authenticateToken, authorizeRoles('user'), controller.findPage);
  router.get('/:id', authenticateToken, authorizeRoles('user'), controller.findById);
  router.get('/:id/addresses', authenticateToken, authorizeRoles('user'), controller.getAddresses);
  router.get('/:id/orders', authenticateToken, authorizeRoles('user'), controller.getOrders);
  router.post('/',  controller.create);
  router.put('/:id', authenticateToken, authorizeRoles('user'), controller.update);
  router.delete('/:id', authenticateToken, authorizeRoles('user'), controller.delete);

  return router;
}