
import { Request, Response, NextFunction } from "express";
import { refreshAccessToken } from "../../utils/jwt";
import { AuthError, AuthErrorCode } from "../../utils/errors";
import logger from "../../configs/logger";


class TokenController {

    handleRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const refreshToken = req.cookies.refreshToken 


            if (!refreshToken) {
                throw new AuthError(AuthErrorCode.TOKEN_EXPIRED)
            }
    
            const newAccessToken = refreshAccessToken(refreshToken);
    
            res.status(200).json({ 
                accessToken: newAccessToken,
                message: 'Access token refreshed successfully' 
            });
    
        } catch (error) {
            logger.error('error refreshing tokens', error)
            next(error)
        }
    }
}

export default TokenController
