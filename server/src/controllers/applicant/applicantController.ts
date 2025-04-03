import {
  IApplicantController,
  IApplicantService,
} from "src/interfaces/IApplicant";
import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { BadRequestError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class ApplicantController implements IApplicantController {
  private applicantService: IApplicantService;

  constructor(
    @inject(TYPES.IApplicantService) applicantService: IApplicantService
  ) {
    this.applicantService = applicantService;
  }

  createApplicant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const applicantData = req.body;

      if (
        !req.files ||
        !(req.files as { [fieldname: string]: Express.Multer.File[] })[
          "idProof"
        ]
      ) {
        throw new BadRequestError("ID Proof is required");
      }

      if (
        !req.files ||
        !(req.files as { [fieldname: string]: Express.Multer.File[] })["resume"]
      ) {
        throw new BadRequestError("Resume required");
      }

      const uploadedFiles = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const idProofFile = uploadedFiles["idProof"][0];
      const resumeFile = uploadedFiles["resume"][0];

      await this.applicantService.createApplicant(
        applicantData,
        idProofFile,
        resumeFile
      );

      res.status(201).json({
        message: "Applicant created successfully",
      });
    } catch (error) {
      logger.error("controller:error fetching patients data ", error);
      next(error);
    }
  };

  getApplicants = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const params = {
        page: parseInt(req.query.page as string),
        limit: parseInt(req.query.limit as string),
        search: req.query.search as string,
      };

      const result = await this.applicantService.getApplicants(params);

      res.status(200).json({ result });
    } catch (error) {
      logger.error("error listing applicants", error);
      next(error);
    }
  };

  getApplicant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { applicantId } = req.params;

      if (!applicantId) {
        throw new BadRequestError("Bad Request");
      }

      const applicant = await this.applicantService.getApplicant(applicantId);

      res.status(200).json({
        applicant,
        message: "Applicant fetched Successfully",
      });
    } catch (error) {
      logger.error("error fetching applicant details", error);
      next(error);
    }
  };

  deleteApplicant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { applicantId } = req.params;

      if (!applicantId) {
        throw new BadRequestError("Bad Request");
      }

      await this.applicantService.deleteApplicant(applicantId);

      res.status(200);
    } catch (error) {
      logger.error("error deleteing applicant", error);
      next(error);
    }
  };
}

export default ApplicantController;
