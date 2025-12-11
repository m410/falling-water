import { Request, Response } from 'express';
import { User } from '../usr/user';
import jwt from 'jsonwebtoken';

const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    role: 'admin',
    name: 'Admin User',
    email: 'test@test.com',
    created_at: new Date(),
  },
  {
    id: 2,
    username: 'user',
    password: 'user',
    role: 'user',
    name: 'User user',
    email: 'test1@test.com',
    created_at: new Date(),
  },
];

export class AuthEndpoints {
  login = (req: Request, res: Response) => {
    const { username, password } = req.body as Partial<User>;
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) 
        return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.json({ token });
  };

  admin = (req: Request, res: Response) => {
    res.json({ message: `Hello Admin ${req.user?.username}` });
  }

  profile = (req: Request, res: Response) => {
    res.json({
      message: `Hello ${req.user?.username}, role: ${req.user?.role}`,
    });
  }
}
