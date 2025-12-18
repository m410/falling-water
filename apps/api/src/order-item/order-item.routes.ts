import { Router } from 'express';
import { OrderItemEndpoints } from './order-item.endpoints';
import { authenticateToken, authorizeRoles } from '../auth/auth';

export function createOrderItemRoutes(controller: OrderItemEndpoints): Router {
  const router = Router();

  router.get('/', authenticateToken, authorizeRoles('user'), controller.findAll);
  router.get('/order/:orderId', authenticateToken, authorizeRoles('user'), controller.findByOrderId);
  router.get('/:id', authenticateToken, authorizeRoles('user'), controller.findById);
  router.post('/', authenticateToken, authorizeRoles('user'), controller.create);
  router.put('/:id', authenticateToken, authorizeRoles('user'), controller.update);
  router.delete('/:id', authenticateToken, authorizeRoles('user'), controller.delete);

  return router;
}
