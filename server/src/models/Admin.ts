import { Schema, model } from 'mongoose';
import IAdmin from '../interfaces/IAdmin';

const adminSchema = new Schema<IAdmin>(
    {
        email: { type: String, required: true },
        password: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);


export const AdminModel = model<IAdmin>('Admin', adminSchema);