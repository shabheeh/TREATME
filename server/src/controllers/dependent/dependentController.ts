import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import IDependent, { IDependentController, IDependentService } from "../../interfaces/IDependent";
import { AppError } from "../../utils/errors";


class DependentController implements IDependentController {
    
    private dependentService: IDependentService

    constructor(dependentService: IDependentService) {
        this.dependentService = dependentService
    }

    createDependent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if(!req.user) {
                throw new AppError('User not authenticated')
            }

            const imageFile: Express.Multer.File | undefined = req.file;


            const dependentData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                gender: req.body.gender,
                primaryUserId: req.body.primaryUserId,
                dateOfBirth: req.body.dateOfBirth
            } as IDependent

            const dependent = await this.dependentService.createDependent(dependentData, imageFile)

            res.status(201).json({
                dependent,
                message: 'Added Dependent successfully'
            })

        } catch (error) {
            logger.error('error creating dependent', error.message)
            next(error)
        }
    }

    getDependents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            
            const primaryUserId = req.params.id;

            const dependents = await this.dependentService.getDependents(primaryUserId)

            res.status(200).json(dependents)
        } catch (error) {
            logger.error('error fetching dependents')
            next(error)
        }
    }
}

export default DependentController;