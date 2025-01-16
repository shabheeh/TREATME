import { Model } from 'mongoose';
import IUser, { IUsersFilter, IUsersFilterResult } from "../interfaces/IUser";
import IUserRepository from "./interfaces/IUserRepository";

class UserRepository implements IUserRepository {
   private readonly model: Model<IUser>;

   constructor(model: Model<IUser>) {
       this.model = model;
   }

   async createUser(user: Partial<IUser>): Promise<IUser> {
       try {
           const newUser = await this.model.create(user);
           return newUser.toObject();
       } catch (error) {
           throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
       }
   }

   async findUserByEmail(email: string): Promise<IUser | null> {
       try {
           const user = await this.model.findOne({ email })
               .lean();
           return user;
       } catch (error) {
           throw new Error(`Failed to find user by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
       }
   }

   async findUserById(id: string): Promise<IUser | null> {
       try {
           const user = await this.model.findById(id)
               .select('-password')
               .lean();
           return user;
       } catch (error) {
           throw new Error(`Failed to find user by id: ${error instanceof Error ? error.message : 'Unknown error'}`);
       }
   }

   async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
       try {
           const updatedUser = await this.model.findByIdAndUpdate(
               id,
               { $set: userData },
               { 
                   new: true,
                   runValidators: true,
                   lean: true
               }
           ).select('-password');
           
           return updatedUser;
       } catch (error) {
           throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
       }
   }

   async getUsers(filter: IUsersFilter): Promise<IUsersFilterResult> {
        try {
            const { page, limit, search } = filter;
            const skip = (page - 1) * limit;

            const query: any = {}

            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }

            ]

            const users = await this.model.find(query)
                .skip(skip)
                .limit(limit)
            const total = await this.model.countDocuments(query)

            return {
                users,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        } catch (error) {
            throw new Error(`Failed to fetch patients data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
   }
}


export default UserRepository;