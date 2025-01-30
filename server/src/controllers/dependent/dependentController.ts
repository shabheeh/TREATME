import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import IDependent, { IDependentController, IDependentService } from "../../interfaces/IDependent";
import { AppError, BadRequestError } from "../../utils/errors";


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
                relationship: req.body.relationship,
                dateOfBirth: req.body.dateOfBirth
            } as IDependent

            const dependent = await this.dependentService.createDependent(dependentData, imageFile)

            res.status(201).json({
                dependent,
                message: 'Added Dependent successfully'
            })

        } catch (error) {
            logger.error('error creating dependent', error)
            next(error)
        }
    }

    getDependents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            
            const primaryUserId = req.params.id;

            const dependents = await this.dependentService.getDependents(primaryUserId)

            res.status(200).json({ dependents })
        } catch (error) {
            logger.error('error fetching dependents')
            next(error)
        }
    }

    deleteDependent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            
            const id = req.params.id;

            await this.dependentService.deleteDependent(id)

            res.status(200)

        } catch (error) {
            logger.error('error deleteing dependent') 
            next(error)
        }
    }

    updateDependent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;

            if (!id) {
                throw new BadRequestError('Something went wrong')
            }

            const imageFile: Express.Multer.File | undefined = req.file;

            const updateData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                gender: req.body.gender,
                relationship: req.body.relationship,
                dateOfBirth: req.body.dateOfBirth
            }

            const dependent = await this.dependentService.updateDependent(id, updateData, imageFile)


            res.status(200).json({
                dependent,
                message: 'Profile updated successfully'
            })

        } catch (error) {
            logger.error('error updating profile', error)
            next(error)
        }
    }
}

export default DependentController;