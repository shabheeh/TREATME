interface Address {
  street: string;
  city: string;
  landmark: string;
  state: string;
  pincode: string;
}

export interface IPatient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  dateOfBirth: string;
  address?: Address;
  isActive: boolean;
  profilePicture?: string;
  imagePublicId?: string;
}

export interface authState {
  isAuthenticated: boolean;
  user: IPatient | null;
  isSignUp: boolean;
}

export interface IDependent {
  _id: string;
  primaryUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: "male" | "female";
  relationship: string;
  dateOfBirth: string;
  profilePicture?: string;
  imagePublicId?: string;
}

export interface IPatientForDoctor {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isDependent: boolean;
  primaryPatientId?: string;
  lastVisit: Date;
}
