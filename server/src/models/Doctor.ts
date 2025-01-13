import { Schema, model } from 'mongoose';
import IDoctor from '../interfaces/IDoctor'; 


const slotSchema = new Schema({
  startTime: { type: String, required: true }, 
  endTime: { type: String, required: true },   
  isBooked: { type: Boolean, default: false }, 
});


const availabilitySchema = new Schema({
  day: { type: String, required: true },
  slots: { type: [slotSchema], default: [] }, 
});


const doctorSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    specialization: { type: Schema.Types.ObjectId, ref: 'Specialization', required: true },
    specialties: { type: [String], default: [] },
    registerNo: { type: String, required: true, unique: true },
    experience: { type: Number, required: true, min: 0 },
    biography: { type: String, trim: true },
    availability: { type: [availabilitySchema], default: [] },
  },
  {
    timestamps: true, 
  }
);


export const DoctorModel = model<IDoctor>('Doctor', doctorSchema);
