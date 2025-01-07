import { api } from "../../utils/axiosInterceptor";
import { IUser } from "../../types/user/authTypes"
import TokenManager from "../../utils/TokenMangager";
import logger from "../../../../shared/configs/logger"

interface IAuthServiceUser {
    signInUser(credentials: { email: string, password: string }): Promise<{ token: string, user: IUser}>;
    
    signOutUser(): void;
}

class AuthServiceUser implements IAuthServiceUser {

    private tokenManager: TokenManager;

    constructor(tokenManger: TokenManager) {
        this.tokenManager = tokenManger
    }

    async signInUser(credentials: { email: string; password: string; }): Promise<{ token: string, user: IUser,}> {
        try {
            const response = await api.user.post('auth/signin', credentials);
            this.tokenManager.setTokens('user', response.data.accessToken, response.data.refreshToken)
            return response.data;
        } catch (error) {
            logger.error(error.message)
        }
    }

    signOutUser(): void {
        this.tokenManager.clearTokens('user');
        window.location.href = '/user/signin'
    }
}