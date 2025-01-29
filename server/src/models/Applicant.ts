import { Schema, model } from 'mongoose';
import { IApplicant } from '../interfaces/IApplicant';

const applicantSchema = new Schema<IApplicant>(
    {
        email: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        registerNo: { type: String, required: true },
        speciality: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);


export const ApplicantModel = model<IApplicant>('Applicant', applicantSchema);