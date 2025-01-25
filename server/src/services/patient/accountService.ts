import IPatientRepository from "src/repositories/interfaces/IPatientRepository";
import IPatient, { IPatientAccountService } from "../../interfaces/IPatient";
import { AppError } from "../../utils/errors";
import logger from "../../configs/logger";
import { updateCloudinaryImage, uploadToCloudinary } from "../../utils/uploadImage";


class PatientAcccountService implements IPatientAccountService {

    private patientRepository: IPatientRepository;

    constructor(patientRepository: IPatientRepository) {
        this.patientRepository = patientRepository
    }
    


    async updateProfile(identifier: string, patientData: IPatient, imageFile: Express.Multer.File | undefined): Promise<IPatient | null> {
        try {

            const patient = await this.patientRepository.findPatientByEmail(identifier);

            let imageUrl: string;
            let imageId: string;

            if (imageFile) {
                if (patient?.profilePicture && patient.imagePublicId ) {
                    const cloudinaryResponse = await updateCloudinaryImage(patient.imagePublicId, imageFile, 'ProfilePictures/Patient')
                    imageUrl = cloudinaryResponse.url;
                    imageId = cloudinaryResponse.publicId
                }else {
                    const cloudinaryResponse = await uploadToCloudinary(imageFile, 'ProfilePictures/Patients')
                    imageUrl = cloudinaryResponse.url;
                    imageId = cloudinaryResponse.publicId
                }

                patientData.profilePicture = imageUrl;
                patientData.imagePublicId = imageId
            }
            
            const result = await this.patientRepository.updatePatient(identifier, patientData)

            return result;

        } catch (error) {
            logger.error('error google signin', error)
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

export default PatientAcccountService;