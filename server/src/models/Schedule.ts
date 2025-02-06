import { Schema, model } from "mongoose";
import { Schedule, Slot } from "../interfaces/IDoctor";


const slotSchema = new Schema<Slot>({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isBooked: { type: Boolean, default: false }
});

const scheduleSchema = new Schema<Schedule>({
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, unique: true }, // One per doctor
    availability: [
        {
            date: { type: Date, required: true },
            slots: [slotSchema] 
        }
    ]
});

export const AvailabilityModel =  model<Schedule>("Schedule", scheduleSchema);
