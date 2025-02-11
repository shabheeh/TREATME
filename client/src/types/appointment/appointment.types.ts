import { IDoctor } from "../doctor/doctor.types";
import { IDependent, IPatient } from "../patient/patient.types";
import { ISpecialization } from "../specialization/specialization.types";

export default interface IAppointment {
    _id: string;
    patientId: string;
    doctorId: string;
    specialization: string,
    reason: string,
    fee: number;
    date: Date;
    duration: string;
    status: string;
    slotId: string;
    dayId: string;
}

export interface IAppointmentPopulated {
    _id: string;
    patient: IPatient | IDependent;
    doctor: IDoctor;
    specialization: ISpecialization;
    reason: string;
    fee: number;
    date: Date;
    duration: string;
    status: string
}