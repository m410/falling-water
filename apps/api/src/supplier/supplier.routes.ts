import { Router } from 'express';
import { SupplierEndpoints } from './supplier.endpoints';

export function createSupplierRoutes(controller: SupplierEndpoints): Router {
  const router = Router();

  router.get('/', controller.findAll);
  router.get('/:id', controller.findById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  // Product relationship routes
  router.get('/:id/products', controller.getProducts);
  router.post('/:id/products', controller.addProduct);
  router.delete('/:id/products/:productId', controller.removeProduct);

  return router;
}
