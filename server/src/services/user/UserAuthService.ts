import bcrypt from 'bcryptjs';
import IUser, { IUserAuthService, SignInResult, googleSignInResult } from '../../interfaces/IUser';
import IUserRepository from '../../repositories/interfaces/IUserRepository';
import { generateTokens, TokenPayload } from '../../utils/jwt';
import CacheService from '../CacheService';
import OtpService from '../OtpService';
import logger from '../../configs/logger';
import { OAuth2Client } from 'google-auth-library';

const mailSubject = {
    verifyEmail: "Verify Your Email Address",
    resetPassword: "Reset Your Password"
}


class UserAuthService implements IUserAuthService {

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
        try {

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
        } catch (error) {
            logger.error('errro sending otp', error.message)
            throw new Error(`error sending otp ${error.message}`)
        }
     
    }

    async verifyOtp(email: string, otp: string): Promise<void> {
        try {
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
        } catch (error) {
            logger.error('errro verifying otp', error.message)
            throw new Error(`error verifying otp ${error.message}`)
        }
        

    }

    async signup(user: IUser): Promise<{ newUser: Partial<IUser>}> {
        try {

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

            const { password, ...userWithoutPassword } = newUser;

            return { newUser: userWithoutPassword };
        } catch (error) {
            logger.error('error during signup', error.message)
            throw new Error(`Somethig went wrong ${error.message}`)
        }
        
    }

    async signin(email: string, password: string): Promise<SignInResult> {
        try {
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

            const payload: TokenPayload = {
                email: user.email,
                role: 'patient',
            }

            const { accessToken, refreshToken } = generateTokens(payload)

            return { accessToken, refreshToken, user }

        } catch (error) {
            logger.error('errro signin user', error.message)
            throw new Error(`error signin user ${error.message}`)
        }
        
    }


    async getUserByEmail(email: string): Promise<IUser> {
        try {

            const user = await this.userRepository.findUserByEmail(email);
            
            if (!user) {
                throw new Error('User not found');
            }

            return user

        } catch (error) {
            logger.error('errro sending otp for forgot password', error.message)
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
            logger.error('errro sending otp for forgot password', error.message)
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

    async googleSignIn(credential: string): Promise<googleSignInResult> {
        try {
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();


            if (!payload || !payload.email || !payload.given_name || !payload.family_name) {
                throw new Error('invalid token')
            }


            let user = await this.userRepository.findUserByEmail(payload.email)
            let partialUser = false;

            if(user) {
                const jwtPayload: TokenPayload = {
                    email: user.email,
                    role: 'patient',
                }

                const { accessToken, refreshToken } = generateTokens(jwtPayload);

                return { user, accessToken, refreshToken, partialUser }
            }

            const newUser = {
                email: payload.email,
                firstName: payload.given_name,
                lastName: payload.family_name,
                profilePicture: payload.picture
            }

            await this.cacheService.store(`google:${newUser.email}`, JSON.stringify(newUser), 300);

            const jwtPayload: TokenPayload = {
                email: payload.email,
                role: 'patient'  
            }

            const { accessToken, refreshToken } = generateTokens(jwtPayload)

            return { newUser, accessToken, refreshToken, partialUser: true }

        } catch (error) {
            logger.error('error google signin', error)
            throw new Error('error signin with google')
        }
    }

    async completeProfileAndSignUp(userData: IUser): Promise<IUser> {
        try {

            const user = await this.userRepository.createUser(userData)
            
            if (!user) {
                throw new Error('Failed crate new user')
            }

            return user
            
        } catch (error) {
            logger.error('error creating a new googleUser', error)
            throw new Error('error crating a new google user')
        }
    }

    async resendOtp(email: string): Promise<void> {
        try {
            await this.otpService.deleteOTP(email, 'signup')

            const otp = await this.otpService.sendOTP(email, 'signup', mailSubject.verifyEmail)

            if (!otp) {
                throw new Error('Failed to resend otp')
            } 

            logger.info(otp)

        } catch (error) {
            logger.error('error re-sending otp', error)
            throw new Error('Failed to resend otp')
        }
    }

    async resendOtpForgotPassword(email: string): Promise<void> {
        try {
            await this.otpService.deleteOTP(email, 'signin')

            const otp = await this.otpService.sendOTP(email, 'signin', mailSubject.resetPassword)

            if (!otp) {
                throw new Error('Failed to resend otp')
            } 

            logger.info(otp)

        } catch (error) {
            logger.error('error re-sending otp', error)
            throw new Error('Failed to resend otp')
        }
    }

    


}


export default UserAuthService