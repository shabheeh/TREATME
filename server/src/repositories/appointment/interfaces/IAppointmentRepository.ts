import {
  IAppointment,
  IAppointmentPopulated,
} from "src/interfaces/IAppointment";
import { IBaseRepository } from "src/repositories/base/interfaces/IBaseRepository";

interface IAppointmentRepository extends IBaseRepository<IAppointment> {
  getAppointmentById(id: string): Promise<IAppointmentPopulated>;
  updateAppointment(
    id: string,
    appointmentData: Partial<IAppointment>
  ): Promise<IAppointment>;
  getAppointmentsByPatientId(patientId: string): Promise<IAppointment[]>;
  getAppointmentsByDoctorId(doctorId: string): Promise<IAppointment[]>;
  getAppointments(): Promise<IAppointmentPopulated[]>;
  getTodaysAppointments(): Promise<IAppointmentPopulated[]>;
  getAppointmentByPaymentId(id: string): Promise<IAppointmentPopulated>;
  getAppointmentByPatientAndDoctorId(
    patientId: string,
    doctorId: string
  ): Promise<IAppointment | null>;
  getPatientsByDoctor(
    doctorId: string,
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<{ patients: IPatientForDoctor[]; totalPatients: number }>;
  getMonthlyRevenue(): Promise<RevenueData>;
  getWeeklyRevenue(): Promise<RevenueData>;
  getYearlyRevenue(): Promise<RevenueData>;
  getWeeklyAppointments(): Promise<{ day: string; count: number }[]>;
  getTodaysAppointmentByDoctor(
    doctorId: string
  ): Promise<IAppointmentPopulated[]>;
  getMonthlyRevenueByDoctor(doctorId: string): Promise<RevenueData>;
  getYearlyRevenueByDoctor(doctorId: string): Promise<RevenueData>;
  getWeeklyRevenueByDoctor(doctorId: string): Promise<RevenueData>;
  getWeeklyAppointmentsByDoctor(
    doctorId: string
  ): Promise<{ day: string; count: number }[]>;
}

export default IAppointmentRepository;

export interface IPatientForDoctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  dateOfBirth: string;
  gender: "male" | "female";
  isDependent: boolean;
  primaryPatientId?: string;
  lastVisit: Date;
}

export interface RevenuePeriod {
  period: string;
  revenue: number;
  appointmentCount: number;
}

export interface RevenueData {
  timeData: RevenuePeriod[];
  totalRevenue: number;
  totalAppointments: number;
}
