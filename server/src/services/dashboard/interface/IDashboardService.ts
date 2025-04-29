import { IAppointmentPopulated } from "src/interfaces/IAppointment";
import IDoctor from "src/interfaces/IDoctor";
import IPatient from "src/interfaces/IPatient";
import {
  IPatientForDoctor,
  RevenuePeriod,
} from "src/repositories/appointment/interfaces/IAppointmentRepository";

interface IDashboardService {
  getAdminDashboardStats(
    filter: "monthly" | "weekly" | "yearly"
  ): Promise<AdminDashboardData>;
  getDoctorDashboardStats(
    doctorId: string,
    filter: "monthly" | "weekly" | "yearly"
  ): Promise<DoctorDashboardData>;
}

export default IDashboardService;

export type AdminDashboardData = {
  revenueData: RevenuePeriod[];
  totalRevenue: number;
  patients: IPatient[];
  totalPatients: number;
  doctors: IDoctor[];
  totalDoctors: number;
  todaysAppointments: IAppointmentPopulated[];
  weeklyAppointments: {
    day: string;
    count: number;
  }[];
  ageGroupCounts: {
    ageGroup: string;
    count: number;
  }[];
  specializationDoctorCount: {
    specialization: string;
    count: number;
  }[];
  totalAppointments: number;
  filter: "monthly" | "yearly" | "weekly";
};

export type DoctorDashboardData = {
  revenueData: RevenuePeriod[];
  weeklyAppointments: {
    day: string;
    count: number;
  }[];
  totalRevenue: number;
  todaysAppointments: IAppointmentPopulated[];
  averageRating: number;
  totalTodaysAppointment: number;
  patients: IPatientForDoctor[];
  totalPatients: number;
  totalAppointments: number;
  filter: "monthly" | "yearly" | "weekly";
};
