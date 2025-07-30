import { IConsultationPopulated } from "src/interfaces/IConsultation";
import { IMedication } from "src/interfaces/IHealthHistory";

export interface ConsultationDTO {
  id: string;
  appointment: {
    appointmentId: string;
    date: Date;
    duration: number;
    status: string;
  };
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    imagePublicId?: string;
  };
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    specialization: string;
    imagePublicId: string;
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

export const toConsultationDTO = (
  consultation: IConsultationPopulated
): ConsultationDTO => {
  return {
    id: consultation._id.toString(),
    appointment: {
      appointmentId: consultation.appointment._id as string,
      date: consultation.appointment.date,
      duration: consultation.appointment.duration,
      status: consultation.appointment.status,
    },
    patient: {
      id: consultation.patient._id as string,
      firstName: consultation.patient.firstName,
      lastName: consultation.patient.lastName,
      dateOfBirth: consultation.patient.dateOfBirth,
      gender: consultation.patient.gender,
      imagePublicId: consultation.patient.imagePublicId,
    },
    doctor: {
      id: consultation.doctor._id,
      firstName: consultation.doctor.firstName,
      lastName: consultation.doctor.lastName,
      specialization: consultation.doctor.specialization,
      imagePublicId: consultation.doctor.imagePublicId,
    },
    symptoms: consultation.symptoms,
    diagnosis: consultation.diagnosis,
    prescriptions: consultation.prescriptions,
    followUp: {
      required: consultation.followUp.required,
      timeFrame: consultation.followUp.timeFrame,
    },
    notes: consultation.notes,
    createdAt: consultation.createdAt,
    updatedAt: consultation.updatedAt,
  };
};
