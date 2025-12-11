import express, { Express, Request, Response, NextFunction } from 'express';
import { ServiceContainer } from './service.container';
import { UserEndpoints } from './usr/user.endpoints';
import { createUserRoutes } from './usr/user.routes';
import { createContainer } from './service.container';
import { AuthEndpoints } from './auth/auth.endpoints';
import { createAuthRoutes } from './auth/auth.routes';
import { pool } from './db/db';

// ============================================
// APPLICATION SETUP
// ============================================

export function createApp(container: ServiceContainer): Express {
  const app = express();

  app.use(express.json());
  app.locals.container = container;

  app.use('/api', createAuthRoutes(new AuthEndpoints()));
  app.use('/api/users', createUserRoutes(new UserEndpoints(
    container.userService,
    container.emailService
  )));

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

// ============================================
// SERVER START
// ============================================

async function startServer() {
  const container = createContainer(pool);
  const app = createApp(container);
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
