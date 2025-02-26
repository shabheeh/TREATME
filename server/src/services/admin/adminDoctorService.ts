import IDoctor, {
  IDoctorsFilter,
  IDoctorsFilterResult,
} from "src/interfaces/IDoctor";
import IDoctorRepository from "../../repositories/doctor/interfaces/IDoctorRepository";
import bcrypt from "bcryptjs";
import logger from "../../configs/logger";
import { IAdminDoctorService } from "src/interfaces/IAdmin";
import { AppError } from "../../utils/errors";
import { sendEmail } from "../../utils/mailer";
import { generateWelcomeDoctorHtml } from "../../helpers/welcomeDoctor";
import { uploadToCloudinary } from "../../utils/uploadImage";

class AdminDoctorService implements IAdminDoctorService {
  private doctorRepository: IDoctorRepository;

  constructor(doctorRepository: IDoctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  async createDoctor(
    doctor: IDoctor,
    imageFile: Express.Multer.File
  ): Promise<Partial<IDoctor>> {
    try {
      const cloudinaryResponse = await uploadToCloudinary(
        imageFile,
        "ProfilePictures/Doctors"
      );
      const imageUrl = cloudinaryResponse.url;
      const imageId = cloudinaryResponse.publicId;

      doctor.profilePicture = imageUrl;
      doctor.imagePublicId = imageId;

      const notHashedPassword = doctor.password;

      const hashedPassword = await bcrypt.hash(notHashedPassword, 10);

      doctor.password = hashedPassword;

      const newDoctor = await this.doctorRepository.createDoctor(doctor);

      const { password, ...withoutPassword } = newDoctor;
      void password;

      const html = generateWelcomeDoctorHtml(
        withoutPassword.email,
        notHashedPassword
      );

      await sendEmail(
        withoutPassword.email,
        "Welcome to Treamtme",
        undefined,
        html
      );

      return withoutPassword;
    } catch (error) {
      logger.error("error creating a new doctor", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async getDoctors(filter: IDoctorsFilter): Promise<IDoctorsFilterResult> {
    try {
      return await this.doctorRepository.getDoctors(filter);
    } catch (error) {
      logger.error("error creating a new doctor", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default AdminDoctorService;
