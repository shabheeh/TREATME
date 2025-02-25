import { Request, Response, NextFunction } from "express";
import logger from "../../configs/logger";
import { IReviewController, IReviewService } from "../../interfaces/IReview";

class ReviewController implements IReviewController {
  private reviewService: IReviewService;

  constructor(reviewService: IReviewService) {
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
      res.status(200).json({ review });
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
      const reviews = await this.reviewService.getDoctorReviews(doctorId);
      res.status(200).json({ reviews });
    } catch (error) {
      logger.error("Controller: Failed to fetch review for doctor");
      next(error);
    }
  };
}

export default ReviewController;
