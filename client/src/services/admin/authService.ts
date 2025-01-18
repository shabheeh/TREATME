import { AxiosError } from "axios";
import { api } from "../../utils/axiosInterceptor";
import TokenManager from "../../utils/TokenMangager";




class AuthServiceAdmin {

    private tokenManager: TokenManager

    constructor(tokenManager: TokenManager) {
        this.tokenManager = tokenManager
    }


    async signIn(email: string, password: string): Promise<void> {
        try {
            const response = await api.admin.post('/auth/signin', { email, password });

            if ('error' in response) {
                throw new Error(`Something went wrong`)
            }

            const { accessToken } = response.data

            this.tokenManager.setToken('admin', accessToken)

        } catch (error: unknown) {
        
              if (error instanceof AxiosError) {
                console.error(`error user signup: ${error.message}`, error);
                throw new Error(`Error signin admin ${ error.message}`)
              }
          
              console.error(`Unknown error occurred during otp verification`, error);
              throw new Error(`Something went error`)

              
            }
    }
}

const tokenManager = new TokenManager();
const authServiceAdmin = new AuthServiceAdmin(tokenManager);

export default authServiceAdmin