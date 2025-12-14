import { Router } from 'express';
import { AddressEndpoints } from './address.endpoints';

export function createAddressRoutes(controller: AddressEndpoints): Router {
  const router = Router();

  router.get('/', controller.findAll);
  router.get('/:id', controller.findById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
}
