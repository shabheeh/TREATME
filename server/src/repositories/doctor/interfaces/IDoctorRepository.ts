import { ObjectId, Types } from "mongoose";
import IDoctor, {
  IDoctorsFilter,
  IDoctorsFilterResult,
} from "src/interfaces/IDoctor";

import { ISchedule } from "src/interfaces/ISchedule";
export interface getDoctorsWithSchedulesQuery {
  specialization: ObjectId;
  gender: string | null;
  language: string | null;
  page: number;
  selectedDate: Date | string;
}

export interface IDoctorWithSchedule extends IDoctor {
  availability: ISchedule;
}

export interface getDoctorsWithSchedulesResult {
  doctors: IDoctorWithSchedule[];
  currentPage: number;
  totalPages: number;
}

export type MatchStage = {
  specialization?: Types.ObjectId;
  gender?: string;
  $or?: Array<{
    firstName?: { $regex: string; $options: string };
    lastName?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
    phone?: { $regex: string; $options: string };
  }>;
};

interface IDoctorRepository {
  createDoctor(doctor: Partial<IDoctor>): Promise<IDoctor>;
  findDoctorByEmail(email: string): Promise<IDoctor | null>;
  findDoctorById(email: string): Promise<IDoctor>;
  updateDoctor(
    doctorId: string,
    updateData: Partial<IDoctor>
  ): Promise<IDoctor>;
  getDoctors(filter: IDoctorsFilter): Promise<IDoctorsFilterResult>;
  getDoctorsWithSchedules(
    query: getDoctorsWithSchedulesQuery
  ): Promise<getDoctorsWithSchedulesResult>;
  getDoctorWithPassword(doctorId: string): Promise<IDoctor>;
}

export default IDoctorRepository;
