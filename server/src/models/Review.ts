import { model, Schema, Types } from "mongoose";
import IReview from "src/interfaces/IReview";

const reviewSchema = new Schema<IReview>(
  {
    doctor: { type: Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: Types.ObjectId, ref: "Patient", required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const ReviewModel = model<IReview>("Review", reviewSchema);
