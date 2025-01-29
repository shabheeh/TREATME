import { Schema, model } from 'mongoose';
import IPatient from '../interfaces/IPatient';


const addressSchema = new Schema({
  city: { type: String, required: true, trim: true },
  landmark: { type: String, trim: true },
  pincode: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  street: { type: String, required: true, trim: true },
});


const patientSchema = new Schema<IPatient>(
  {
    email: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, optional: true, trim: true },
    password: { type: String, optional: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    dateOfBirth: { type: Date, optional: true }, 
    address: addressSchema,
    profilePicture: { type: String, trim: true },
    imagePublicId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    phone: { type: String, optional: true, trim: true },
  },
  {
    timestamps: true,
  }
);

export const PatientModel = model<IPatient>('Patient', patientSchema);
