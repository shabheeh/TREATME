import { IDoctor } from "../../types/doctor/doctor.types";
import { api } from "../../utils/axiosInterceptor";


class DoctorAuthService {



    async signIn(email: string, password: string): Promise<IDoctor> {
        try {
            
            const response = await api.doctor.post('/auth/signin', { email, password })

            const { doctor } = response.data;

            return doctor

        } catch (error: unknown) {
        
            if (error instanceof Error) {
                console.error(`Error Signin doctor: ${error.message}`, error);
                throw new Error(error.message)
            }
        
            console.error(`Unknown error`, error);
            throw new Error(`Something went error`)
            
        }
    }
}

const doctorAuthService = new DoctorAuthService()
export default doctorAuthService