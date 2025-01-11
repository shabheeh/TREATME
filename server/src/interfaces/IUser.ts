import { Document, ObjectId } from 'mongoose';

export interface Address {
  city: string;
  landmark: string;
  pincode: string;
  state: string;
  street: string;
}

export default interface IUser extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  dateOfBirth: Date;
  address?: Address;
  profilePicture?: string;
  isActive: boolean;
  phone: string;
}
