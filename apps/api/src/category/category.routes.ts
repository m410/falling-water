import { Router } from 'express';
import { CategoryEndpoints } from './category.endpoints';

export function createCategoryRoutes(controller: CategoryEndpoints): Router {
  const router = Router();

  router.get('/', controller.findAll);
  router.get('/:id', controller.findById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
}
