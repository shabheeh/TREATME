import { model, Schema } from "mongoose";
import IDependent from "src/interfaces/IDependent";


const dependentSchema = new Schema<IDependent>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    primaryUserId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    email: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    relationship: { type: String, required: true },
    dateOfBirth: { type: Date, optional: true }, 
    profilePicture: { type: String },
    imagePublicId: { type: String },
},
{
    timestamps: true
}
);

export const DependentModel = model<IDependent>('Dependent', dependentSchema)