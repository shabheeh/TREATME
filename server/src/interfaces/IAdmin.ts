import { Document } from "mongoose";

interface IAdmin extends Document {
    email: string;
    password: string;
}

export default IAdmin