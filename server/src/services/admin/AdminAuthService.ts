import bcrpyt from 'bcryptjs';
import logger from '../../configs/logger';
import AdminRespository from '../../repositories/AdminRepository';
import { generateTokens, TokenPayload } from '../../utils/jwt';

interface signInAdminResult {
    accessToken: string,
    refreshToken: string
}



class AdminAuthService {

    private readonly adminRepository: AdminRespository;


    constructor(adminRepository: AdminRespository) {
        this.adminRepository = adminRepository
    }


    async SignUpAdmin(email: string, password: string): Promise<void> {
        try {
            const hashedPassword = await bcrpyt.hash(password, 10);

            const admin = {
                email,
                password: hashedPassword
            }

            await this.adminRepository.createAdmin(admin)

        } catch (error) {
            logger.error('error creagin new adin', error.message)
            throw new Error(`Error creating new admn ${error.message}`)
        }
    }

    async signInAdmin(email: string, password: string): Promise<signInAdminResult> {
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