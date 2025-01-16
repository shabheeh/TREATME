import bcrpyt from 'bcryptjs';
import logger from '../../configs/logger';
import IAdminRepository from 'src/repositories/interfaces/IAdminRepository';
import { generateTokens, TokenPayload } from '../../utils/jwt';
import { IAdminAuthService, SignInAdminResult } from '../../interfaces/IAdmin';





class AdminAuthService implements IAdminAuthService {

    private readonly adminRepository: IAdminRepository;


    constructor(adminRepository: IAdminRepository) {
        this.adminRepository = adminRepository
    }

    async signInAdmin(email: string, password: string): Promise<SignInAdminResult> {
        try {
            
            const admin = await this.adminRepository.findAdminByEmail(email)

            if (!admin) {
                throw new Error('Error finding admin')
            }

            const isPasswordMatch = await bcrpyt.compare(password, admin.password)

            if (!isPasswordMatch) {
                throw new Error(" invalid email or password")
            }

            const payload: TokenPayload = {
                email: admin.email,
                role: 'admin'
            }

            const { accessToken, refreshToken } = generateTokens(payload)

            return { accessToken, refreshToken }

        } catch (error) {
            logger.error('service: error sign in admin', error.message)
            throw new Error(`Error sign in admin: ${error.message}`)
        }
    }
}


export default AdminAuthService