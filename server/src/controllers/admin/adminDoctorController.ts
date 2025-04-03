import {
  IAdminDoctorController,
  IAdminDoctorService,
} from "src/interfaces/IAdmin";
import logger from "../../configs/logger";
import { Request, Response, NextFunction } from "express";
import { generatePassword } from "../../helpers/passwordGenerator";
import IDoctor from "../../interfaces/IDoctor";
import { BadRequestError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class AdminDoctorController implements IAdminDoctorController {
  private adminDoctorService: IAdminDoctorService;

  constructor(
    @inject(TYPES.IAdminDoctorService)
    adminDoctorService: IAdminDoctorService
  ) {
    this.adminDoctorService = adminDoctorService;
  }

  createDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.file) {
        throw new BadRequestError("Profile Picture is not provided");
      }

      const doctor = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        password: generatePassword(),
        gender: req.body.gender,
        biography: req.body.biography,
        specialization: req.body.specialization,
        specialties: req.body.specialties,
        languages: req.body.languages,
        licensedState: req.body.licensedState,
        registerNo: req.body.registerNo,
        experience: req.body.experience,
      } as IDoctor;

      const imageFile = req.file;

      const newDoctor = await this.adminDoctorService.createDoctor(
        doctor,
        imageFile
      );

      res.status(201).json({
        doctor: newDoctor,
        message: "new Doctor created Successfully",
      });
    } catch (error) {
      logger.error("controller:error crating new Doctor ", error);
      next(error);
    }
  };

  getDoctors = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = {
        specialization: req.query.specialization as string,
        gender: req.query.gender as string,
        search: req.query.search as string,
        page: parseInt(req.query.page as string),
        limit: parseInt(req.query.limit as string),
      };

      const result = await this.adminDoctorService.getDoctors(query);

      res.status(200).json({ result });
    } catch (error) {
      logger.error("controller:error crating new Doctor ", error);
      next(error);
    }
  };

  updateDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;

      if (!doctorId) {
        throw new BadRequestError("Doctor id required");
      }

      console.log(req.body);

      const updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        biography: req.body.biography,
        specialization: req.body.specialization,
        specialties: req.body.specialties,
        languages: req.body.languages,
        licensedState: req.body.licensedState,
        registerNo: req.body.registerNo,
        experience: req.body.experience,
      } as Partial<IDoctor>;

      const imageFile: Express.Multer.File | undefined = req.file;

      await this.adminDoctorService.updateDoctor(
        doctorId,
        updateData,
        imageFile
      );
      res.status(200).json({
        success: true,
        message: "Updated Doctor Successfully",
      });
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      next(error);
    }
  };
}

export default AdminDoctorController;
