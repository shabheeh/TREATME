import { Document, ObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";

interface IReview extends Document {
  doctor: ObjectId;
  patient: ObjectId;
  rating: number;
  comment: string;
}

export default IReview;

export interface IReviewService {
  addOrUpdateReview(reviewData: IReview): Promise<IReview>;
}

export interface IReviewController {
  addOrUpdateReview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
