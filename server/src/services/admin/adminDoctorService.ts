import IDoctor, { IDoctorsFilter, IDoctorsFilterResult } from "src/interfaces/IDoctor";
import IDoctorRepository from "../../repositories/interfaces/IDoctorRepository";
import bcrypt from 'bcryptjs';
import logger from "../../configs/logger";
import { IAdminDoctorService } from "src/interfaces/IAdmin";

class AdminDoctorService implements IAdminDoctorService {

    private doctorRepository: IDoctorRepository

    constructor(doctorRepository: IDoctorRepository) {
        this.doctorRepository = doctorRepository
    }

    async createDoctor(doctor: IDoctor): Promise<Partial<IDoctor>> {
        try {
            const notHashedPassword = doctor.password;

            const hashedPassword = await bcrypt.hash(notHashedPassword, 10)

            doctor.password = hashedPassword

            const newDoctor = await this.doctorRepository.createDoctor(doctor)

            const { password, ...withoutPassword } = newDoctor;

            return withoutPassword;

        } catch (error) {
            logger.error('error creating a new doctor', error.message)
            throw new Error(`Error creating a new doctor ${error.message}`)
        }
    }


    async getDoctors(params: IDoctorsFilter): Promise<IDoctorsFilterResult> {
        try {
            const filter = {
                page: Math.max(1, params.page || 1),
                limit: Math.min(50, Math.max(1, params.limit || 5)),
                search: params.search?.trim() || ''
            }

            return await this.doctorRepository.getDoctors(filter)


        } catch (error) {
            logger.error('error creating a new doctor', error.message)
            throw new Error(`Error creating a new doctor ${error.message}`)
        }
    }
}

export default AdminDoctorService