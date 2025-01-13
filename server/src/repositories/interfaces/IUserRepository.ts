import IUser from "../../interfaces/IUser";

interface IUserRepository {
    createUser(user: Partial<IUser>): Promise<IUser>;
    findUserByEmail(email: string): Promise<IUser | null>;
    findUserById(id: string): Promise<IUser | null>;
    updateUser(id: string,  updateData: Partial<IUser>): Promise<IUser | null>;
}

export default IUserRepository