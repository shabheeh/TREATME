import { Schema, model } from 'mongoose';
import IUser from '../interfaces/IUser'; // Adjust path if necessary


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
    password: { type: String, optional: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    dateOfBirth: { type: Date, required: true },
    address: addressSchema,
    profileImage: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    phone: { type: String, required: true, trim: true },
    bloodGroup: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// Create and export the User model
export const UserModel = model<IUser>('User', userSchema);
