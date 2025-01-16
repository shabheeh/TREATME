import { Schema, model } from 'mongoose';
import IUser from '../interfaces/IUser';


const addressSchema = new Schema({
  city: { type: String, required: true, trim: true },
  landmark: { type: String, trim: true },
  pincode: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  street: { type: String, required: true, trim: true },
});


const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, optional: true, trim: true },
    password: { type: String, optional: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    dateOfBirth: { type: Date, optional: true }, 
    address: addressSchema,
    profilePicture: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    phone: { type: String, optional: true, trim: true },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>('User', userSchema);
