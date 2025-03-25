import { IAppointmentPopulated } from "src/interfaces/IAppointment";
import IDoctor from "src/interfaces/IDoctor";
import IPatient from "src/interfaces/IPatient";

interface IDashboardService {
  getDashboardStats(): Promise<DashboardData>;
}

export default IDashboardService;

export type DashboardData = {
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
  };
  ageGroupCounts: {
    ageGroup: string;
    count: number;
  }[];
  specializationDoctorCount: {
    specialization: string;
    count: number;
  };
};
