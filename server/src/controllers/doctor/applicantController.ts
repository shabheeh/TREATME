import { IApplicantController, IApplicantService } from "src/interfaces/IDoctor";
import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";


class ApplicantController implements IApplicantController {
    
    private applicantService: IApplicantService;

    constructor(applicantService: IApplicantService) {
        this.applicantService = applicantService
    }

    createApplicant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { applicant } = req.body;

            await this.applicantService.createApplicant(applicant)

            res.status(201).json({
                message: 'Applicant created successfully'
            })


        } catch (error) {
            logger.error('controller:error fetching patients data ', error.message);
            next(error)
        }
    }
}

export default ApplicantController