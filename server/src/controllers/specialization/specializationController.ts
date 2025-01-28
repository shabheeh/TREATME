import { NextFunction, Request, Response } from "express";
import ISpecialization, { ISpecializationController, ISpecializationService } from "../../interfaces/ISpecilazation";
import { BadRequestError } from "../../utils/errors";
import logger from "../../configs/logger";

class SpecializationController implements ISpecializationController {

    private specializationService: ISpecializationService 
    
    constructor(specializationService: ISpecializationService) {
        this.specializationService = specializationService
    }

    createSpecialization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {


            if (!req.file) {
                throw new BadRequestError('Image is not provided')
            }

            const specialization = {
                name: req.body.name,
                description: req.body.description,
                note: req.body.note,
                fee: req.body.fee,
            } as ISpecialization

            const imageFile = req.file

            await this.specializationService.createSpecialization(specialization, imageFile)

            res.status(201).json({
                message: 'Specialization created successfully'
            })

        } catch (error) {
            logger.error('Error creating Specialization', error.message);
            next(error)
        }
    }

    getSpecializations = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const specializations = await this.specializationService.getSpecializations()


            res.status(200).json({
                specializations,
                message: 'Specializations fetched successfully'
            })

        } catch (error) {
            logger.error('Error Fetching Specializations', error.message);
            next(error)
        }
    }

    getSpecializationById = async(req: Request, res: Response, next: NextFunction): Promise<void> =>  {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('Something went wrong')
            }

            const specialization = await this.specializationService.getSpecializationById(id)

            res.status(200).json({
                specialization,
                message: 'Fetched Specialization Successfully'
            })

        } catch (error) {
            logger.error('Error Fetching Specialization', error.message);
            next(error)
        }
    }

    updateSpecialization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('Something went wrong')
            }



            const updateData = {
                name: req.body.name,
                description: req.body.description,
                note: req.body.note,
                fee: req.body.fee
            } as ISpecialization
            
            const imageFile: Express.Multer.File | undefined = req.file;
            

            const updatedData = await this.specializationService.updateSpecialization(id, updateData, imageFile)

            res.status(200).json({
                updatedData,
                message: 'Specialization updated successfully'
            })

        } catch (error) {
            logger.error('Error upadating Specializations', error.message);
            next(error)
        }
    }
}


export default SpecializationController