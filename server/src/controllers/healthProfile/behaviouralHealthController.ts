import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { IBehaviouralHealthController, IBehaviouralHealthService } from "../../interfaces/IBehaviouralHealth";
import { BadRequestError } from "../../utils/errors";


class BehaviouralHealthController implements IBehaviouralHealthController {

    private behavioralHealthService: IBehaviouralHealthService;

    constructor(behaviouralHealthService: IBehaviouralHealthService) {
        this.behavioralHealthService = behaviouralHealthService;
    }

    getBehaviuoralHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('Bad Request: Missing info')
            }

            const behavioralHealth = await this.behavioralHealthService.findBehaviouralHealth(id);

            res.status(200).json({ behavioralHealth })

        } catch (error) {
            logger.error('failed to fetch behavioural health', error)
            next(error)
        }
    }

    updateBehavouralHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { updateData } = req.body;

            if (!id || !updateData) {
                throw new BadRequestError('Bad Reqeuest: Missing info')
            }

            const behavioralHealth = await this.behavioralHealthService.updateBehavouralHealth(id, updateData);

            res.status(200).json({ behavioralHealth });

        } catch (error) {
            logger.error('failed to update behavioural health', error)
            next(error)
        }
    }
}

export default BehaviouralHealthController;