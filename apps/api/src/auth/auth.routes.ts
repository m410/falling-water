import { Router } from 'express';
import { AuthEndpoints } from './auth.endpoints';

export function createAuthRoutes(controller: AuthEndpoints): Router {
  const router = Router();

  router.post('/login', controller.login);
  router.post('/register', controller.register);
  router.get('/logout', controller.logout);

  return router;
}