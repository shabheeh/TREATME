import { model, Schema, Types } from "mongoose";
import IAppointment from "src/interfaces/IAppointment";



const appointmentSchema = new Schema<IAppointment>({
    patientId: { type: Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Types.ObjectId, ref: 'Doctor', required: true },
    specialization: { type: Types.ObjectId, ref: 'Specialization', required: true },
    reason: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: String, required: true },
    status: { type: String, required: true }
},
{
    timestamps: true,
}
);

export const AppointmentModal = model<IAppointment>('Appointment', appointmentSchema)