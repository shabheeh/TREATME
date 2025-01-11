
interface Address {
    street: string;
    city: string;
    landmark: string;
    state: string;
    pincode: string;
}


export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: 'male' | 'female';
    dateOfBirth: string;
    address?: Address;
}

export interface authState {
    isAuthenticated: boolean;
    user: IUser | null;
    isSignUp: boolean;
}