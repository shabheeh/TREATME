import { model, Schema } from 'mongoose';
import ISpecialization from 'src/interfaces/ISpecilazation';

const specializationSchema = new Schema<ISpecialization>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    note: { type: String, required: true },
    fee: { type: Number, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const SpecializationModel = model<ISpecialization>(
  'Specialization',
  specializationSchema
);
