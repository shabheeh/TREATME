import { IMedication } from "../patient/health.types";

export interface IPrescription {
  name: string;
  frequency: string;
  reportedBy: string;
}

export interface IConsultation {
  _id: string;
  appointment: string;
  patient: string;
  patientType: "Patient" | "Doctor";
  doctor: string;
  symptoms?: string[];
  prescriptions?: IPrescription[];
  diagnosis?: string;
  followUp: {
    required: boolean;
    timeFrame?: string;
  };
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IConsultationPopulated {
  id: string;
  appointment: {
    appointmentId: string;
    date: string;
    duration: number;
    status: string;
  };
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    imagePublicId: string;
  };
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    imagePublicId: string;
    specialization: string;
  };
  symptoms: string[];
  diagnosis: string;
  prescriptions: IMedication[];
  followUp: {
    required: boolean;
    timeFrame?: string;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
