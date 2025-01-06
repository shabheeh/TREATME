import bcrypt from 'bcryptjs';
import IUser from '../interfaces/IUser';
import IUserRepository from '../repositories/interfaces/IUserRepository';
import { signToken } from '../utils/jwt';
import CacheService from './CacheService';
import OtpService from './OptService';


class UserService {

    private userRepository: IUserRepository;
    private otpService: OtpService;
    private cacheService: CacheService;

    constructor(
        userRepository: IUserRepository, 
        otpService: OtpService,
        cacheService: CacheService
    ) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.cacheService = cacheService;
    }


    async sendOtp(email: string, password: string): Promise<void> {

        const existingUser = await this.userRepository.findUserByEmail(email)

        if (existingUser) {
            throw new Error('User with this email already exists')
        }

        await this.cacheService.store(`signup:${email}`, JSON.stringify({email, password}), 600)

        const otpSent = await this.otpService.sendOTP(email)

        console.log(otpSent)

        if (!otpSent) {
            throw new Error('Failed to sent otp, please try again later')
        }
    }

    async verifyOtp(email: string, otp: string): Promise<void> {

        const userData = await this.cacheService.retrieve(`signup:${email}`)

        if (!userData) {
            throw new Error('Signup session expired, please try again')
        }

        const parsedUserData = JSON.parse(userData)
    

       const isOtpVerified = await this.otpService.verifyOTP(email, otp) 

       if(!isOtpVerified) {
        throw new Error('Invalid Otp')
       }

       await this.cacheService.store(
        `signup:${email}`,
        JSON.stringify({ ...parsedUserData, isOtpVerified: true }),
        600
       )

       await this.otpService.deleteOTP(email);

    }

    async signup(user: IUser): Promise<{ newUser: IUser}> {

        const cachedUserData = await this.cacheService.retrieve(`signup:${user.email}`)

        if (!cachedUserData) {
            throw new Error('Sign up session is expired')
        }

        const parsedUserData = JSON.parse(cachedUserData);

        if (!parsedUserData.isOtpVerified) {
            throw new Error('Please verify your email first')
        }

        const hashedPassword = await bcrypt.hash(parsedUserData.password, 0);

        user.password = hashedPassword


        const newUser = await this.userRepository.createUser(user);

        await this.cacheService.delete(`signup:${user.email}`)

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


    async getUserByEmail(email: string): Promise<Partial<IUser>> {
        try {

            const user = await this.userRepository.findUserByEmail(email);
            
            if (!user) {
                throw new Error('User not found');
            }

            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;

        } catch (error) {
            throw new Error(`Error fetching user by email: ${error.message}`);
        }
    }

}


export default UserService