export interface IReview {
  doctor: string;
  patient: string;
  rating: number;
  comment: string;
}

export interface IReviewPopulated {
  _id: string;
  doctor: string;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
