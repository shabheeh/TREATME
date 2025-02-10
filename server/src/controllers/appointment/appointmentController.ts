import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { IAppointmentController, IAppointmentService } from "../../interfaces/IAppointment";


class AppointmentController implements IAppointmentController {

    private appointmentService: IAppointmentService;

    constructor(appointmentService: IAppointmentService) {
        this.appointmentService = appointmentService
    }

    createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { appointmentData } = req.body;

            const appointment = await this.appointmentService.createAppointment(appointmentData)

            res.status(201).json({ appointment })

        } catch (error) {
            logger.error('Failed to create appointment', error);
            next(error)
        }
    }

    updateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { updateData } = req.body;

            const appointment = await this.appointmentService.updateAppointment(id, updateData);

            res.status(200).json({ appointment })

        } catch (error) {
            logger.error('Failed to update appointment')
            next(error)
        }
    }
}

export default AppointmentController;