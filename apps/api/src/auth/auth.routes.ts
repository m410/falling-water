import { Router } from 'express';
import { AuthEndpoints } from './auth.endpoints';
import { authenticateToken, authorizeRoles } from './auth';

export function createAuthRoutes(controller: AuthEndpoints): Router {
  const router = Router();

  router.post('/login', controller.login);
  router.post('/register', controller.register);
  router.get('/logout', controller.logout);
  router.get('/profile', authenticateToken, authorizeRoles('admin', 'user'), controller.profile);
  router.get('/admin', authenticateToken, authorizeRoles('admin'), controller.admin);

  return router;
}