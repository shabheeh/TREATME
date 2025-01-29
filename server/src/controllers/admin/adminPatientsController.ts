import { Request, Response } from "express";
import { IAdminPatientsController, IAdminPatientsService } from "../../interfaces/IAdmin";
import logger from "../../configs/logger";



class AdminPatientsController implements IAdminPatientsController {

    private adminPatientsService: IAdminPatientsService;

    constructor(adminPatientsService: IAdminPatientsService) {
        this.adminPatientsService = adminPatientsService;
    }

    getPatients = async (req: Request, res: Response): Promise<void> => {
        try {
            const params = {
                page: parseInt(req.query.page as string),
                limit: parseInt(req.query.limit as string),
                search: req.query.search as string
            }

            const result = await this.adminPatientsService.getPatients(params)

            res.status(200).json({ result })

        } catch (error) {
            logger.error('controller:error fetching patients data ', error.message);
            throw new Error(`Error fetching patients data ${error.message}`)
        }
    }
}


export default AdminPatientsController;