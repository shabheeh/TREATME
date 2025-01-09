import jwt from 'jsonwebtoken';
import logger from '../configs/logger';


const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets are not defined in env');
}

// Types
interface TokenPayload {
    id: string;
    email: string;
    role: string;
    exp?: number;
    iat?: number;
}

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export const generateTokens = (payload: TokenPayload): Tokens => { 
    try {
        const accessToken = jwt.sign(
            payload,
            JWT_ACCESS_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            payload,
            JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    } catch (error) {
        logger.error('Error generating tokens:', error);
        throw new Error('Failed to generate tokens');
    }
};

export const verifyAccessToken = <T>(token: string): T => {
    try {
        return jwt.verify(token, JWT_ACCESS_SECRET) as T;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.warn('Access token expired');
            throw new Error('Token expired');
        }
        logger.error('Error verifying access token:', error);
        throw new Error('Invalid access token');
    }
};

export const verifyRefreshToken = <T>(token: string): T => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as T;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.warn('Refresh token expired');
            throw new Error('Refresh token expired');
        }
        logger.error('Error verifying refresh token:', error);
        throw new Error('Invalid refresh token');
    }
};

export const refreshAccessToken = (refreshToken: string): string => {
    try {
        const decoded = verifyRefreshToken<TokenPayload>(refreshToken);

        const { id, email, role } = decoded;
        
        const accessToken = jwt.sign(
            { id, email, role },
            JWT_ACCESS_SECRET,
            { expiresIn: '1h' }
        );

        return accessToken;
    } catch (error) {
        logger.error('Error refreshing access token:', error);
        throw new Error('Failed to refresh access token');
    }
};


export const extractTokenFromHeader = (authHeader: string | undefined): string => {
    if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('No token provided or invalid format');
    }
    return authHeader.split(' ')[1];
};

