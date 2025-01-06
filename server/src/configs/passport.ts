import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserRepository from "../repositories/UserRepository";
import IUserRepository from "../repositories/interfaces/IUserRepository";
import IUser from "../interfaces/IUser";

const userRepository: IUserRepository = new UserRepository();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth credentials missing');
}

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            scope: ['profile', 'email'],
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) throw new Error('Email not provided');

                const existingUser = await userRepository.findUserByEmail(email);

                if (existingUser) {
                    return done(null, existingUser);
                }

                const partialUser: Partial<IUser> = {
                    email,
                    firstName: profile.name?.givenName || '',
                    lastName: profile.name?.familyName || '',
                    profileImage: profile.photos?.[0]?.value,
                };

                return done(null, partialUser);
            } catch (error) {
                console.error('Error during GoogleStrategy:', error);
                done(error as Error);
            }
        }
    )
);


passport.serializeUser((user: Express.User, done) => {
    const partialUser = user as Partial<IUser>;

    if (partialUser._id) {
        done(null, partialUser._id.toString());
    } else {
        done(null, partialUser.email); 
    }
});

passport.deserializeUser(async (idOrEmail: string, done) => {
    try {
        if (idOrEmail.includes('@')) {  

            const partialUser = await userRepository.findUserByEmail(idOrEmail);
            done(null, partialUser);
        } else {
            const user = await userRepository.findUserById(idOrEmail);
            done(null, user);
        }
    } catch (error) {
        console.error('Error during deserializeUser:', error);
        done(error);
    }
});


export default passport;
