import IReview from "src/interfaces/IReview";
import { IReviewService } from "../../interfaces/IReview";
import IReviewRepository from "src/repositories/review/interface/IReviewRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class ReviewService implements IReviewService {
  private reviewRepo: IReviewRepository;

  constructor(@inject(TYPES.IReviewRepository) reviewRepo: IReviewRepository) {
    this.reviewRepo = reviewRepo;
  }

  async addOrUpdateReview(reviewData: IReview): Promise<IReview> {
    return this.reviewRepo.createOrUpdateReview(reviewData);
  }

  async getDoctorReviews(doctorId: string): Promise<IReview[]> {
    return this.reviewRepo.findReviewsByDoctorId(doctorId);
  }
}

export default ReviewService;
