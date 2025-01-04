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
        return await UserModel.findOne({ _id: id });
    }
}

export default UserRepository;