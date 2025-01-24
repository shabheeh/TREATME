import { IAdminDoctorController, IAdminDoctorService } from "src/interfaces/IAdmin";
import logger from "../../configs/logger";
import { Request, Response, NextFunction } from "express";
import { generatePassword } from "../../helpers/passwordGenerator";
import IDoctor from "../../interfaces/IDoctor";
import { BadRequestError } from "../../utils/errors";


class AdminDoctorController implements IAdminDoctorController {

    private adminDoctorService: IAdminDoctorService

    constructor(adminDoctorService: IAdminDoctorService) {
        this.adminDoctorService = adminDoctorService
    }

    createDoctor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            if (!req.file) {
                throw new BadRequestError('Profile Picture is not provided')
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
                specialties: JSON.parse(req.body.specialties),
                languages: JSON.parse(req.body.languages),
                registerNo: req.body.registerNo,
                experience: JSON.parse(req.body.experience),
              } as IDoctor
              
              const imageFile = req.file
             

            const newDoctor = await this.adminDoctorService.createDoctor(doctor, imageFile)

            res.status(201).json({
                doctor: newDoctor,
                message: 'new Doctor created Successfully'
            })

 
        } catch (error) {
            logger.error('controller:error crating new Doctor ', error.message);
            next(error)
        }
    }

    getDoctors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const params = {
                page: parseInt(req.query.page as string),
                limit: parseInt(req.query.limit as string),
                search: req.query.search as string
            }

            const result = await this.adminDoctorService.getDoctors(params)

            res.status(200).json({ result })

        } catch (error) {
            logger.error('controller:error crating new Doctor ', error.message);
            next(error)
        }
    }


} 

export default AdminDoctorController