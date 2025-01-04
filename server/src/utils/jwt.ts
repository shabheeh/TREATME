import jwt from 'jsonwebtoken';
import logger from '../configs/logger';

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

if(!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in env')
}

export const signToken = (userId: string): string => {
  try {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
  } catch (error) {
    logger.error('Error signing token:', error);
    throw new Error('Failed to sign the token');
  }
};

export const verifyToken = <T>(token: string): T => {
    try {
      return jwt.verify(token, JWT_SECRET) as T;
    } catch (error) {
      logger.error('Error verifying token:', error);
      throw new Error('Failed to verify the token');
    }
  };