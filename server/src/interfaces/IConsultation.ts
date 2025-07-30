import { Document, Types } from "mongoose";
import { IMedication } from "./IHealthHistory";
import { IAppointment } from "./IAppointment";
import IPatient from "./IPatient";
import IDependent from "./IDependent";

export interface IConsultation extends Document {
  appointment: Types.ObjectId;
  patient: Types.ObjectId;
  patientType: "Patient" | "Dependent";
  doctor: Types.ObjectId;
  symptoms?: string[];
  prescriptions?: IMedication[];
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
  _id: string;
  appointment: IAppointment;
  patient: IPatient | IDependent;
  patientType: "Patient" | "Dependent";
  doctor: {
    _id: string;
    firstName: string;
    lastName: string;
    imagePublicId: string;
    specialization: string;
  };
  symptoms: string[];
  prescriptions: IMedication[];
  diagnosis: string;
  followUp: {
    required: boolean;
    timeFrame?: string;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConsultation {
  appointment: Types.ObjectId;
  patient: Types.ObjectId;
  patientType: "Patient" | "Dependent";
  doctor: Types.ObjectId;
}
