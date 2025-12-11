import { UserService } from './usr/user.repository';
import { EmailService } from './usr/user.email';
import { Pool } from 'pg';

export interface ServiceContainer {
  userService: UserService;
  emailService: EmailService;
  db: Pool;
}

export function createContainer(db: Pool): ServiceContainer {
  const emailService = new EmailService();
  const userService = new UserService(db);

  return {
    userService,
    emailService,
    db,
  };
}
