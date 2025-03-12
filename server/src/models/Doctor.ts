import { Model, Schema, model } from "mongoose";
import IDoctor from "../interfaces/IDoctor";

const doctorSchema = new Schema<IDoctor>(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    specialization: {
      type: Schema.Types.ObjectId,
      ref: "Specialization",
      required: true,
    },
    specialties: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    registerNo: { type: String, required: true, unique: true },
    experience: { type: Number, required: true, min: 0 },
    biography: { type: String, trim: true },
    licensedState: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    profilePicture: { type: String, required: true },
    imagePublicId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const DoctorModel: Model<IDoctor> = model<IDoctor>(
  "Doctor",
  doctorSchema
);
