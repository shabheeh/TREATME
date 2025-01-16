import IUser from "../../interfaces/IUser";
import { IUsersFilter, IUsersFilterResult } from "../../interfaces/IUser";
interface IUserRepository {
    createUser(user: Partial<IUser>): Promise<IUser>;
    findUserByEmail(email: string): Promise<IUser | null>;
    findUserById(id: string): Promise<IUser | null>;
    updateUser(id: string,  updateData: Partial<IUser>): Promise<IUser | null>;
    getUsers(filter: IUsersFilter): Promise<IUsersFilterResult>
}

export default IUserRepository


