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
                specialization: req.query.specialization,
                gender: req.query.gender,
                language: req.query.language,
                page: req.query.page,
                selectedDate: req.query.selectedDate || new Date()
            } as getDoctorsWithSchedulesQuery;

            console.log(query)

            const result = await this.doctorService.getDoctorsWithSchedules(query);

            res.status(200).json({ result })

        } catch (error) {
            logger.error(error instanceof Error ? error.message : 'Failed to fetch Doctors');
            next(error)
        }
    }
}

export default DoctorController;