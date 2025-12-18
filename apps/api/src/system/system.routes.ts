import { Router } from 'express';
import { SystemEndpoints } from './system.endpoints';
import { authenticateToken, authorizeRoles } from '../auth/auth';

export function createSystemRoutes(controller: SystemEndpoints): Router {
  const router = Router();

  router.get('/', authenticateToken, authorizeRoles('admin'), controller.findPage);
  router.get('/:id', authenticateToken, authorizeRoles('admin'), controller.findById);
  router.post('/', authenticateToken, authorizeRoles('admin'), controller.create);
  router.put('/:id', authenticateToken, authorizeRoles('admin'), controller.update);
  router.delete('/:id', authenticateToken, authorizeRoles('admin'), controller.delete);

  return router;
}
