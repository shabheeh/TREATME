
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
    gender: 'male' | 'female';
    dateOfBirth: string;
    address?: Address;
    isActive: boolean;
    profilePicture?: string;
}

export interface authState {
    isAuthenticated: boolean;
    user: IPatient | null;
    isSignUp: boolean;
}