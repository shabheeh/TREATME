import { IAppointmentPopulated } from "../appointment/appointment.types";
import { IDoctor } from "../doctor/doctor.types";
import { IPatient } from "../patient/patient.types";

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
