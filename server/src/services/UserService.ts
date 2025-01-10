import bcrypt from 'bcryptjs';
import IUser from '../interfaces/IUser';
import IUserRepository from '../repositories/interfaces/IUserRepository';
import { generateTokens } from '../utils/jwt';
import CacheService from './CacheService';
import OtpService from './OtpService';
import logger from '../configs/logger';

const mailSubject = {
    verifyEmail: "Verify Your Email Address",
    resetPassword: "Reset Your Password"
}

type SignInResult = {  
    message: string, 
    googleUser: boolean } | {
    user: IUser,
    accessToken: string,
    refreshToken: string 
}

type googleCallbackResult = { 
    partialUser: Partial<IUser> } | { 
    accessToken: string,
    refreshToken: string, 
    user: IUser
}


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

        const otpSent = await this.otpService.sendOTP(email, 'signup', mailSubject.verifyEmail)

        logger.info(otpSent) 

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
    

       const isOtpVerified = await this.otpService.verifyOTP(email, otp, 'signup') 

       if(!isOtpVerified) {
        throw new Error('Invalid Otp')
       }

       await this.cacheService.store(
        `signup:${email}`,
        JSON.stringify({ ...parsedUserData, isOtpVerified: true }),
        600
       )

       await this.otpService.deleteOTP(email, 'signup');

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

    async signin(email: string, password: string): Promise<SignInResult> {

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

        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: 'user',
        }

        const { accessToken, refreshToken } = generateTokens(payload)

        return { accessToken, refreshToken, user }
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

    async sendOtpForgotPassword(email: string): Promise<IUser> {
        try {
            const user = await this.userRepository.findUserByEmail(email);

        if (!user) {
            throw new Error('No User found with this email')
        }

        const isOtpSent = await this.otpService.sendOTP(email, 'signin', mailSubject.resetPassword)

        if(!isOtpSent) {
            throw new Error('Failed to sent otp, Please try again later')
        }

        return user
        

        } catch (error) {
            logger.error(error.message)
            throw new Error(`error sending otp ${error.message}`)
        } 
    }

    async verifyOtpForgotPassword(email: string, otp: string): Promise<boolean> {
        try {
            const isOtpVerified = await this.otpService.verifyOTP(email, otp, 'signin');

            return isOtpVerified;

        } catch (error) {
            logger.error('error sign in with google', error.message)
            throw new Error(`Somethig went wrong ${error.message}`)
        }
    }


    async resetPassword(id: string, password: string): Promise<void> {
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            const updateData = await this.userRepository.updateUser(id, { password: hashedPassword })
        
            if (!updateData) {
                throw new Error('Error reseting password')
            }

        } catch (error) {
            logger.error('error reseting password', error.message)
            throw new Error(`Somethig went wrong ${error.message}`)
        }
    }

    async googleCallback(googleUser: Partial<IUser>): Promise<googleCallbackResult> {
        try {
            if (!googleUser._id) {
                await this.cacheService.store(`google:${googleUser.email}`, JSON.stringify(googleUser), 300);
                return {
                    partialUser: googleUser
                }
            }

            
            if (!googleUser.email) {
                throw new Error('error sing in with google')
            }

            const payload = {
                id: googleUser._id.toString(),
                email: googleUser.email,
                role: 'patient'
            }

            const user = await this.userRepository.findUserByEmail(googleUser.email);

            if (!user) {
                await this.cacheService.store(`google:${googleUser.email}`, JSON.stringify(googleUser), 300);
                return {
                    partialUser: googleUser
                }
            }

            const { accessToken, refreshToken } = generateTokens(payload)
            
            return {
                accessToken,
                refreshToken,
                user
            }
            
        } catch (error) {
            logger.error('error sign in with google', error.message)
            throw new Error(`Somethig went wrong ${error.message}`)
        }
    }

}


export default UserService