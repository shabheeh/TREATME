import { IDoctor } from "../doctor/doctor.types";

export interface IReview {
  doctor: string;
  patient: string;
  rating: number;
  comment: string;
}

export interface IReviewPopulated {
  doctor: IDoctor;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  rating: number;
  comment: string;
}
