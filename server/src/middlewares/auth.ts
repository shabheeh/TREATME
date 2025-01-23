import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import logger from '../configs/logger';


interface JwtPayload {
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}


export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
  
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return
    }
  
    try {

      const decoded = await verifyAccessToken(token) as JwtPayload
      req.user = decoded;

      next();

    } catch (error) {
        logger.error('Authentication Error', error.message)
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};


export const authorize = (...roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          message: 'Authentication required'
        });
        return
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          message: `Access Denied`,
        });
        return
      }

      next();
    } catch (error: unknown) {

      if(error instanceof Error)

      res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  };
};