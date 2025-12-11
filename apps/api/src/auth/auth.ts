import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserPayload extends JwtPayload {
  id: number;
  username: string;
  role: string;
}

// --- Authentication ---
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    req.user = decoded; // Attach user to request
    next();
  } catch (err) {
    console.error('auth error', err);
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// --- Role-based Authorization ---
export function authorizeRoles(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserPayload | undefined;
    if (!user) return res.status(401).json({ message: 'Not authenticated' });
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}

// --- Extend Express Request type to include user ---
declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}
