import IDoctor, { IDoctorAuthService } from "../../interfaces/IDoctor";
import IDoctorRepository from "../../repositories/interfaces/IDoctorRepository";
import bcrypt from 'bcryptjs'
import { AppError, AuthError, AuthErrorCode } from "../../utils/errors";
import logger from "../../configs/logger";


class DoctorAuthService implements IDoctorAuthService {
    
    private doctorRepository: IDoctorRepository;

    constructor(doctorRepository: IDoctorRepository) {
        this.doctorRepository = doctorRepository
    }

    async signIn(email: string, password: string): Promise<IDoctor> {
        try {
            
            const doctor = await this.doctorRepository.findDoctorByEmail(email)

            if(!doctor) {
                throw new AppError('Something went wrong')
            }

            const isPasswordMatch = await bcrypt.compare(password, doctor.password)


            if (!isPasswordMatch) {
                throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS)
            }

            return doctor

        } catch (error) {
            logger.error('error doctor signin', error)
            if (error instanceof AppError) {
                throw error; 
            }
            throw new AppError(
                `Service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            ); 
        }
    }
}

export default DoctorAuthService