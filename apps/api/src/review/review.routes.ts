import { Router } from 'express';
import { ReviewEndpoints } from './review.endpoints';

export function createReviewRoutes(controller: ReviewEndpoints): Router {
  const router = Router();

  router.get('/', controller.findAll);
  router.get('/:id', controller.findById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
}
