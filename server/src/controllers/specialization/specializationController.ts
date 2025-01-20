import { NextFunction, Request, Response } from "express";
import ISpecialization, { ISpecializationController, ISpecializationService } from "../../interfaces/ISpecilazation";
import { BadRequestError } from "../../utils/errors";
import { uploadToCloudinary } from "../../utils/uploadImage";
import logger from "../../configs/logger";

class SpecializationController implements ISpecializationController {

    private specializationService: ISpecializationService 
    
    constructor(specializationService: ISpecializationService) {
        this.specializationService = specializationService
    }

    createSpecialization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            let imageUrl: string;

            if (req.file) {
                const cloudinaryResponse = await uploadToCloudinary(req.file, 'Specializations');
                imageUrl = cloudinaryResponse.url;
            } else {
                throw new BadRequestError('Image is not provided')
            }

            const specialization = {
                name: req.body.name,
                description: req.body.description,
                note: req.body.note,
                fee: req.body.fee,
                image: imageUrl,
            } as ISpecialization

            await this.specializationService.createSpecialization(specialization)

            res.status(201).json({
                message: 'Specialization created successfully'
            })

        } catch (error) {
            logger.error('Error creating Specialization', error.message);
            next(error)
        }
    }

    getSpecializations = async(_req: Request, res: Response, next: NextFunction): Promise<void> => {
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
}


export default SpecializationController