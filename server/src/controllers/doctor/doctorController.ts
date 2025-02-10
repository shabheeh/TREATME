import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { IDoctorController, IDoctorService } from "../../interfaces/IDoctor";
import { getDoctorsWithSchedulesQuery } from "../../repositories/doctor/interfaces/IDoctorRepository";


class DoctorController implements IDoctorController {
    
    private doctorService: IDoctorService;

    constructor(doctorService: IDoctorService) {
        this.doctorService = doctorService
    }

    getDoctorsWithSchedules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const query = {
                specialization: req.body.specialization,
                gender: req.body.gender,
                language: req.body.language,
                page: req.body.page,
                selectedDate: req.body.selectedDate || new Date()
            } as getDoctorsWithSchedulesQuery;

            const result = await this.doctorService.getDoctorsWithSchedules(query);

            res.status(200).json({ result })

        } catch (error) {
            logger.error(error instanceof Error ? error.message : 'Failed to fetch Doctors');
            next(error)
        }
    }
}

export default DoctorController;