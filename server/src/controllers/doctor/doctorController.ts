import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { IDoctorController, IDoctorService } from "../../interfaces/IDoctor";
import { BadRequestError } from "../../utils/errors";

class DoctorController implements IDoctorController {

    private doctorService: IDoctorService;

    constructor(doctorService: IDoctorService) {
        this.doctorService = doctorService
    }

    updateAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { updateData } = req.body;


            if (!id || !updateData) {
                throw new BadRequestError('Bad Request: Missing info');
            }

            const doctor = await this.doctorService.updateAvailability(id, updateData);

            res.status(200).json({ doctor });

        } catch (error) {
            logger.error('Failed to update doctor', error)
            next(error)
        }
    }
}


export default DoctorController;