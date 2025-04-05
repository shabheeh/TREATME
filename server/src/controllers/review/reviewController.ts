import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { IReviewController, IReviewService } from "../../interfaces/IReview";
import { BadRequestError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";
import { ResponseMessage } from "../../constants/responseMessages";

@injectable()
class ReviewController implements IReviewController {
  private reviewService: IReviewService;

  constructor(@inject(TYPES.IReviewService) reviewService: IReviewService) {
    this.reviewService = reviewService;
  }

  addOrUpdateReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { reviewData } = req.body;
      const review = await this.reviewService.addOrUpdateReview(reviewData);
      res.status(HttpStatusCode.OK).json({ review });
    } catch (error) {
      logger.error("Controller: Failed to create or update review");
      next(error);
    }
  };
  getDoctorReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;
      if (!doctorId) {
        throw new BadRequestError(ResponseMessage.ERROR.INVALID_REQUEST);
      }

      const reviews = await this.reviewService.getDoctorReviews(doctorId);

      res.status(HttpStatusCode.OK).json({ reviews });
    } catch (error) {
      logger.error(
        error instanceof Error
          ? error.message
          : "Controller: Failed fetch reviews for doctor"
      );
      next(error);
    }
  };
}

export default ReviewController;
