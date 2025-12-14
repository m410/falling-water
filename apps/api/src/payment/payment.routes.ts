import { Router } from 'express';
import { PaymentEndpoints } from './payment.endpoints';

export function createPaymentRoutes(controller: PaymentEndpoints): Router {
  const router = Router();

  router.get('/', controller.findAll);
  router.get('/:id', controller.findById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
}
