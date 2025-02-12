import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { IAppointmentController, IAppointmentService } from "../../interfaces/IAppointment";
import { BadRequestError } from "../../utils/errors";


class AppointmentController implements IAppointmentController {

    private appointmentService: IAppointmentService;

    constructor(appointmentService: IAppointmentService) {
        this.appointmentService = appointmentService
    }

    createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { appointmentData } = req.body;

            console.log(appointmentData)

            const appointment = await this.appointmentService.createAppointment(appointmentData)

            res.status(201).json({ appointment })

        } catch (error) {
            logger.error('Failed to create appointment', error);
            next(error)
        }
    }

    getAppointmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {


            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('Bad Request: Missing info')
            }

            const appointment = await this.appointmentService.getAppointmentById(id)

            res.status(200).json({ appointment })
            
        } catch (error) {
            logger.error(error instanceof Error ? error.message : 'failed to get appointment');
            next(error)
        }
    }


    updateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { updateData } = req.body;

            if (!id || !updateData) {
                throw new BadRequestError('Bad Request: Missing info')
            }

            const appointment = await this.appointmentService.updateAppointment(id, updateData);

            res.status(200).json({ appointment })

        } catch (error) {
            logger.error('Failed to update appointment')
            next(error)
        }
    }
}

export default AppointmentController;