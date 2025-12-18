import { Router } from 'express';
import { PaymentEndpoints } from './payment.endpoints';
import { authenticateToken, authorizeRoles } from '../auth/auth';

export function createPaymentRoutes(controller: PaymentEndpoints): Router {
  const router = Router();

  router.get('/', authenticateToken, authorizeRoles('user'), controller.findPage);
  router.get('/sum-last-month', authenticateToken, authorizeRoles('user'), controller.sumLastMonth);
  router.get('/:id', authenticateToken, authorizeRoles('user'), controller.findById);
  router.post('/', authenticateToken, authorizeRoles('user'), controller.create);
  router.put('/:id', authenticateToken, authorizeRoles('user'), controller.update);
  router.delete('/:id', authenticateToken, authorizeRoles('user'), controller.delete);

  return router;
}
