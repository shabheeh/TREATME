import { IAppointmentPopulated } from "src/interfaces/IAppointment";
import IDoctor from "src/interfaces/IDoctor";
import IPatient from "src/interfaces/IPatient";
import { IPatientForDoctor } from "src/repositories/appointment/interfaces/IAppointmentRepository";

interface IDashboardService {
  getAdminDashboardStats(): Promise<AdminDashboardData>;
  getDoctorDashboardStats(doctorId: string): Promise<DoctorDashboardData>;
}

export default IDashboardService;

export type AdminDashboardData = {
  monthlyData: {
    month: string;
    revenue: number;
  }[];
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
};

export type DoctorDashboardData = {
  monthlyData: {
    month: string;
    revenue: number;
  }[];
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
};
