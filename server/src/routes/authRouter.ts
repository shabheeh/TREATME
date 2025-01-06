import express, { Request, Response } from "express";
import passport from "passport";
import { signToken } from "../utils/jwt";
// import UserRepository from "../repositories/UserRepository";
import IUser from "../interfaces/IUser";
import { Session } from "express-session";

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

            const token = signToken(googleUser._id.toString());

            res.status(200).json({ token });
            
        } catch (error) {
            console.error('Error during Google authentication:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);



export default router;
