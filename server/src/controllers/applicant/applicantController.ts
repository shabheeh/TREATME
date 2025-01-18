import { IApplicantController, IApplicantService } from "src/interfaces/IApplicant";
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

    getApplicants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const params = {
                page: parseInt(req.query.page as string),
                limit: parseInt(req.query.limit as string),
                search: req.query.search as string
            }

            const result = await this.applicantService.getApplicants(params)

            res.status(200).json({ result })

        } catch (error) {
            logger.error('error listing applicants', error.message)
            next(error)
        }
    }
}

export default ApplicantController