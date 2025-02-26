import IReview from "../../../interfaces/IReview";

interface IReviewRepository {
  createOrUpdateReview(reviewData: IReview): Promise<IReview>;
}

export default IReviewRepository;
