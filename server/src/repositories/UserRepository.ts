import IUser from "../interfaces/IUser";
import IUserRepository from "./interfaces/IUserRepository";
import { UserModel } from "../models/User";


class UserRepository implements IUserRepository {
    async createUser(user: Partial<IUser>): Promise<IUser> {
        return await UserModel.create(user)
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }

    async findUserById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id);
    }

    async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, userData, { new: true })
    }

}

export default UserRepository;