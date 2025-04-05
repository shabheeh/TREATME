import { Model, Types } from "mongoose";
import IReviewRepository from "./interface/IReviewRepository";
import IReview from "../../interfaces/IReview";
import { AppError, handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class ReviewRepository implements IReviewRepository {
  private readonly model: Model<IReview>;

  constructor(@inject(TYPES.ReviewModel) model: Model<IReview>) {
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
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }

  async findReviewsByDoctorId(doctorId: string): Promise<IReview[]> {
    try {
      const reviews = await this.model
        .find({ doctor: doctorId })
        .populate("patient")
        .lean();

      return reviews;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getAverageRatingByDoctorId(doctorId: string): Promise<number> {
    try {
      const result = await this.model.aggregate([
        { $match: { doctor: new Types.ObjectId(doctorId) } },
        {
          $group: {
            _id: "$doctor",
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      return result.length > 0 ? result[0].averageRating : 0;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }
}

export default ReviewRepository;
