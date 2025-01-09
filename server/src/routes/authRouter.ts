import express, { Request, Response } from "express";
import passport from "passport";
import { generateTokens } from "../utils/jwt";
// import UserRepository from "../repositories/UserRepository";
import IUser from "../interfaces/IUser";
import { Session } from "express-session";
import logger from "../configs/logger";

const router = express.Router();
// const userRepository = new UserRepository();

interface GoogleCallbackRequest extends Request {
    user?: Express.User;
    session: Session & {
        partialUser?: Partial<IUser>;
    };
}

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/signin', failureMessage: 'Authentication failed' }),
    async (req: GoogleCallbackRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Authentication failed' });
                return;
            }

            const googleUser = req.user as Partial<IUser>;

            if (!googleUser._id) {

                req.session.partialUser = googleUser;

                res.status(202).json({
                    partialUser: googleUser,
                    message: 'Additional information required to complete registration',
                });
                return;
            }

            if (!googleUser.email) {
                throw new Error('error sign in with google')
            }

            const payload = {
                id: googleUser._id.toString(),
                email: googleUser.email,
                role: 'user',
            }
    
            const { accessToken, refreshToken } = generateTokens(payload)
            

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            })

            res.status(200).json({
                accessToken, 
                googleUser
            });
            
        } catch (error) {
            logger.error('Error during Google authentication:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);



export default router;
