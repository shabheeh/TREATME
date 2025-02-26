import IReview from "src/interfaces/IReview";
import { IReviewService } from "../../interfaces/IReview";
import IReviewRepository from "src/repositories/review/interface/IReviewRepository";

class ReviewService implements IReviewService {
  private reviewRepo: IReviewRepository;

  constructor(reviewRepo: IReviewRepository) {
    this.reviewRepo = reviewRepo;
  }

  async addOrUpdateReview(reviewData: IReview): Promise<IReview> {
    return this.reviewRepo.createOrUpdateReview(reviewData);
  }
}

export default ReviewService;
