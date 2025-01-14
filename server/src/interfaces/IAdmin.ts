import { Document } from "mongoose";

export default interface IAdmin extends Document {
    email: string;
    password: string;
}

export interface IAdminAuthService {
    SignUpAdmin(email: string, password: string): Promise<void>
}