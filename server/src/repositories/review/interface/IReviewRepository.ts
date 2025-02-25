import IReview from "../../../interfaces/IReview";

interface IReviewRepository {
  createOrUpdateReview(reviewData: IReview): Promise<IReview>;
  findReviewsByDoctorId(doctorId: string): Promise<IReview[]>;
}

export default IReviewRepository;
