import { ObjectId } from 'mongoose';
import IDoctor, {
  IDoctorsFilter,
  IDoctorsFilterResult,
  ISchedule,
} from 'src/interfaces/IDoctor';

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

interface IDoctorRepository {
  createDoctor(doctor: Partial<IDoctor>): Promise<IDoctor>;
  findDoctorByEmail(email: string): Promise<IDoctor | null>;
  findDoctorById(email: string): Promise<IDoctor>;
  updateDoctor(id: string, updateData: Partial<IDoctor>): Promise<IDoctor>;
  getDoctors(filter: IDoctorsFilter): Promise<IDoctorsFilterResult>;
  getDoctorsWithSchedules(
    query: getDoctorsWithSchedulesQuery
  ): Promise<getDoctorsWithSchedulesResult>;
}

export default IDoctorRepository;
