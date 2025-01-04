import bcrypt from 'bcryptjs';
import IUser from '../interfaces/IUser';
import IUserRepository from '../repositories/interfaces/IUserRepository';
import { signToken } from '../utils/jwt';


class UserService {

    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async signup(user: IUser): Promise<{ newUser: IUser}> {
        const existingUser = await this.userRepository.findUserByEmail(user.email);
        if(existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(user.password, 0);
        user.password = hashedPassword;

        const newUser = await this.userRepository.createUser(user);

        return { newUser }
    }

    async signin(email: string, password: string): Promise<{ token?: string; message?: string, googleUser?: boolean }> {
        const user = await this.userRepository.findUserByEmail(email);

        if (!user) {
            throw new Error('Invalid email or password')
        }

        if (!user.password) {
            return {
                googleUser: true,
                message: 'You previously signed in with Google please use Google for future sign in'
            }
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            throw new Error('Invalid Email or Password')
        }

        const token = signToken(user._id.toString())
        return { token }
    }

}


export default UserService