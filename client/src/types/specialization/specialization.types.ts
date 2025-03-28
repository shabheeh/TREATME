export interface ISpecializationCreate {
  name: string;
  description: string;
  note: string;
  fee: number | null;
  image: File | null;
}

export interface ISpecialization {
  _id: string;
  name: string;
  description: string;
  note: string;
  fee: number;
  durationInMinutes: number;
  image: string;
  concerns: string[];
}
