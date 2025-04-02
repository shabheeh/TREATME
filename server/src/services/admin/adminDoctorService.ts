import IDoctor, {
  IDoctorsFilter,
  IDoctorsFilterResult,
} from "src/interfaces/IDoctor";
import IDoctorRepository from "../../repositories/doctor/interfaces/IDoctorRepository";
import bcrypt from "bcryptjs";
import logger from "../../configs/logger";
import { IAdminDoctorService } from "src/interfaces/IAdmin";
import { AppError, BadRequestError } from "../../utils/errors";
import { sendEmail } from "../../utils/mailer";
import { generateWelcomeDoctorHtml } from "../../helpers/welcomeDoctor";
import {
  updateCloudinaryFile,
  uploadToCloudinary,
} from "../../utils/cloudinary";

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

  async updateDoctor(
    doctorId: string,
    updateData: Partial<IDoctor>,
    imageFile: Express.Multer.File | undefined
  ): Promise<IDoctor> {
    try {
      if (updateData.email) {
        const existingDoctor = await this.doctorRepository.findDoctorByEmail(
          updateData.email
        );

        if (existingDoctor) {
          const existingId = (existingDoctor as IDoctor)._id;
          if (existingId && existingId.toString() !== doctorId) {
            throw new BadRequestError("Doctor with this email already exists");
          }
        }
      }
      const doctor = await this.doctorRepository.findDoctorById(doctorId);

      if (imageFile && doctor.imagePublicId) {
        const newImage = await updateCloudinaryFile(
          doctor.imagePublicId,
          imageFile,
          "ProfilePictures/Doctors"
        );

        updateData.profilePicture = newImage.url;
        updateData.imagePublicId = newImage.publicId;
      }

      const updatedDoctor = await this.doctorRepository.updateDoctor(
        doctorId,
        updateData
      );
      return updatedDoctor;
    } catch (error) {
      logger.error("Error upadate doctor", error);
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
