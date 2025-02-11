import jwt from 'jsonwebtoken';
import logger from '../configs/logger';


const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets are not defined in env');
}


// Types
export interface ITokenPayload {
    email: string;
    role: 'admin' | 'patient' | 'doctor';
    exp?: number;
    iat?: number;
}



interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export const generateTokens = (payload: ITokenPayload): Tokens => { 
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
        logger.error('Error verifying accessToken:', error);
        throw new Error('Invalid access token');
    }
};

export const verifyRefreshToken = <T>(token: string): T => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as T;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.warn('RefreshToken expired');
            throw new Error('Refresh token expired');
        }
        logger.error('Error verifying refreshToken:', error);
        throw new Error('Invalid refresh token');
    }
};

export const refreshAccessToken = (refreshToken: string): string => {
    try {
        const decoded = verifyRefreshToken<ITokenPayload>(refreshToken);

        const {email, role } = decoded;
        
        const accessToken = jwt.sign(
            { email, role },
            JWT_ACCESS_SECRET,
            { expiresIn: '1h' }
        );

        return accessToken;

    } catch (error) {
        logger.error('Error refreshing new accessToken:', error);
        throw new Error('faild to refersh new accessToken');
    }
};



