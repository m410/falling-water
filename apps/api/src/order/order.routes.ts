import { Router } from 'express';
import { OrderEndpoints } from './order.endpoints';

export function createOrderRoutes(controller: OrderEndpoints): Router {
  const router = Router();

  router.get('/', controller.findAll);
  router.get('/:id', controller.findById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
}
