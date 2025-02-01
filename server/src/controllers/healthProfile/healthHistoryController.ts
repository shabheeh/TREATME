import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { IHealthHistoryController, IHealthHistoryService } from "../../interfaces/IHealthHistory";
import { BadRequestError } from "../../utils/errors";

class HealthHistoryController implements IHealthHistoryController {
    
    private healthHistoryService: IHealthHistoryService;

    constructor(healthHistoryService: IHealthHistoryService) {
        this.healthHistoryService = healthHistoryService
    }

    getHealthHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError("Bad Request")
            }

            const healthHistory = await this.healthHistoryService.getHealthHistory(id);

            res.status(200).json({ healthHistory })

        } catch (error) {
            logger.error('Failed to fetch health history', error)
            next(error)
        }
    }

    updateHealthHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            
            const { id } = req.params;
            const updateData = req.body;

            if (!id || !updateData) {
                throw new BadRequestError('Bad request')
            }

            const updatedData = await this.healthHistoryService.updateHealthHistory(id, updateData)

            res.status(200).json({
                updatedData
            })

        } catch (error) {
            logger.error('Failded to update health history', error)
            next(error)
        }
    }
}

export default HealthHistoryController;