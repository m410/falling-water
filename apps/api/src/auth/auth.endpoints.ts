import { Request, Response } from 'express';
import { User } from '../usr/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    role: 'admin',
    name: 'Admin User',
    email: 'test@test.com',
    phone: 'test@test.com',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    username: 'user',
    password: 'user',
    role: 'user',
    name: 'User user',
    phone: 'phone',
    email: 'test1@test.com',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export class AuthEndpoints {
  login = (req: Request, res: Response) => {
    const { username, password } = req.body as Partial<User>;

    // todo replace with user service
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    // Compare provided password with hashed password
    // const isValidPassword = await bcrypt.compare(password, user.password);

    // if (!isValidPassword) {
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.json({ token });
  };

  admin = (req: Request, res: Response) => {
    res.json({ message: `Hello Admin ${req.user?.username}` });
  };

  profile = (req: Request, res: Response) => {
    res.json({
      message: `Hello ${req.user?.username}, role: ${req.user?.role}`,
    });
  };

  register = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      // Hash the password (10 is the salt rounds - good balance of security/speed)
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed password:', hashedPassword);

      // Store in database
      // await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.log('Registration error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  logout = (req: Request, res: Response) => {
    // Invalidate token logic would go here (e.g., add to blacklist)
    res.json({ message: 'Logged out successfully' });
  };
}
