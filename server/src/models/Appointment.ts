import { model, Schema, Types } from "mongoose";
import IAppointment from "../interfaces/IAppointment";



const appointmentSchema = new Schema<IAppointment>({
    patientId: { 
        type: Types.ObjectId, 
        required: true,
        refPath: 'patientType', 
        },
    patientType: { 
        type: String,
        enum: ['Patient', 'Dependent'],
        required: true,
    },
    doctorId: { type: Types.ObjectId, ref: 'Doctor'},
    specialization: { type: Types.ObjectId, ref: 'Specialization', required: true },
    reason: { type: String, required: true },
    date: { type: Date,  },
    duration: { type: String,  },
    status: { type: String, required: true },
    fee: { type: Number, required: true },
    slotId: { type: Types.ObjectId },
    dayId: { type: Types.ObjectId }
},
{
    timestamps: true,
}
);

export const AppointmentModel = model<IAppointment>('Appointment', appointmentSchema)