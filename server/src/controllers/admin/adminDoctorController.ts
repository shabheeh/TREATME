import { IAdminDoctorController, IAdminDoctorService } from "src/interfaces/IAdmin";
import logger from "../../configs/logger";
import { Request, Response, NextFunction } from "express";



class AdminDoctorController implements IAdminDoctorController {

    private adminDoctorService: IAdminDoctorService

    constructor(adminDoctorService: IAdminDoctorService) {
        this.adminDoctorService = adminDoctorService
    }

    createDoctor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { doctor } = req.body;

            const newDoctor = await this.adminDoctorService.createDoctor(doctor)

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