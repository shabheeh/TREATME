import { IAppointmentPopulated } from "../appointment/appointment.types";
import { IDoctor } from "../doctor/doctor.types";
import { IPatient, IPatientForDoctor } from "../patient/patient.types";

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
};

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
