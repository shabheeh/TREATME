import { IAdminPatientsService } from "src/interfaces/IAdmin";
import { IUsersFilter, IUsersFilterResult } from "src/interfaces/IUser";
import IUserRepository from "../../repositories/interfaces/IUserRepository";
import logger from "../../configs/logger";
import { AppError } from "../../utils/errors";




class AdminPatientsService implements IAdminPatientsService {

    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async getPatients(params: IUsersFilter): Promise<IUsersFilterResult> {
        try {
            const filter = {
                page: Math.max(1, params.page || 1),
                limit: Math.min(50, Math.max(1, params.limit || 5)),
                search: params.search?.trim() || ''
            }

            return await this.userRepository.getUsers(filter)

        } catch (error) {
            logger.error('error fetching users data', error.message)
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


export default AdminPatientsService