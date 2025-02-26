import { Model } from "mongoose";
import IReviewRepository from "./interface/IReviewRepository";
import IReview from "../../interfaces/IReview";
import { AppError } from "../../utils/errors";

class ReviewRepository implements IReviewRepository {
  private readonly model: Model<IReview>;

  constructor(model: Model<IReview>) {
    this.model = model;
  }

  async createOrUpdateReview(reviewData: IReview): Promise<IReview> {
    try {
      const { patient, doctor, rating, comment } = reviewData;

      const review = await this.model.findOneAndUpdate(
        { patient, doctor },
        { rating, comment },
        { new: true, upsert: true, runValidators: true }
      );

      if (!review) {
        throw new AppError("Failed to add or update Review");
      }

      return review;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default ReviewRepository;
