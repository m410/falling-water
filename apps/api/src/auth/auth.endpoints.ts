import { Request, Response } from 'express';
import { User } from '../usr/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from '../usr/user.repository';
import { OrderRepository } from '../order/order.repository';

const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    roles: ['admin'],
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
    roles: ['user'],
    name: 'User user',
    phone: 'phone',
    email: 'test1@test.com',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export class AuthEndpoints {

  constructor(
    protected userService: UserRepository,
    protected orderService: OrderRepository
  ) {}
  
  login = async (req: Request, res: Response) => {
    const { username, password } = req.body as Partial<User>;

    if (!username || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    };

    if(!this.userService) {
      console.error('UserService not initialized');
      return res.status(500).json({ error: 'Internal server error' });
    }

    await this.userService.findByEmail(username).then(async (user) => {

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, (user as any).password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const payload = { id: user.id, username: user.email, roles: user.roles };
      const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '20m',
      });

      res.json({ token });
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

  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await this.userService.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const orders = await this.orderService.findByUserId(userId);

      // Remove sensitive data
      const { password_hash, ...safeUser } = user as any;

      res.json({
        user: safeUser,
        orders,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Failed to load profile' });
    }
  };
}
