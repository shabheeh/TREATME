import { IDoctor } from "../doctor/doctor.types";
import { IDependent, IPatient } from "../patient/patient.types";
import { ISpecialization } from "../specialization/specialization.types";

export default interface IAppointment {
    _id: string;
    patient: string;
    patientType: 'Patient' | 'Dependent';
    doctor: string;
    specialization: string,
    reason: string,
    fee: number;
    date: Date;
    duration: string;
    status: string;
    slotId: string;
    dayId: string;
    paymentStatus: string;
}

export interface IAppointmentPopulated {
    _id: string;
    patient: IPatient | IDependent;
    patientType: 'Patient' | 'Dependent';
    doctor: IDoctor;
    specialization: ISpecialization;
    reason: string;
    fee: number;
    date: Date;
    duration: string;
    status: string
    paymentStatus: string;
}