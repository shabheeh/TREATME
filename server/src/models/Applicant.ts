import { Schema, model, Types } from "mongoose";
import { IApplicant } from "../interfaces/IApplicant";

const applicantSchema = new Schema<IApplicant>(
  {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    registerNo: { type: String, required: true },
    experience: { type: Number, required: true },
    languages: { type: [String], default: [] },
    specialization: {
      type: Types.ObjectId,
      ref: "Specialization",
      required: true,
    },
    workingTwoHrs: { type: String, required: true },
    licensedState: { type: String, required: true },
    idProof: { type: String, required: true },
    resume: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const ApplicantModel = model<IApplicant>("Applicant", applicantSchema);
