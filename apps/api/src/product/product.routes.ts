import { Router } from 'express';
import { ProductEndpoints } from './product.endpoints';

export function createProductRoutes(controller: ProductEndpoints): Router {
  const router = Router();

  router.get('/', controller.findPage);
  router.get('/:id', controller.findById);
  router.get('/:id/audits', controller.getAuditHistory);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
}
