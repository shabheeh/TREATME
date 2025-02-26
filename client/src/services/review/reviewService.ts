import { IReview, IReviewPopulated } from "../../types/review/review.types";
import { api } from "../../utils/axiosInterceptor";

class ReviewService {
  async addOrUpdateReview(reviewData: IReview): Promise<IReviewPopulated> {
    try {
      const response = await api.post("/reviews", { reviewData });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error adding or updating review: ${error.message}`,
          error
        );
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }
}

const reviewService = new ReviewService();
export default reviewService;
