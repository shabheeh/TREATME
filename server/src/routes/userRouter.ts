
import express from "express";
import UserRepository from "../repositories/UserRepository";
import UserService from "../services/UserService";
import OtpService from "../services/OtpService";
import CacheService from "../services/CacheService";
import UserController from "../controllers/UserController";
import { signupValidation, signinValidation } from "../validators/userValidator";
import { errors } from 'celebrate';
import passport from "passport";

const router = express.Router();

const userRepository = new UserRepository();
const cacheService = new CacheService()
const otpService = new OtpService(cacheService)
const userService = new UserService(userRepository, otpService, cacheService);
const userController = new UserController(userService, otpService);


router.post('/auth/send-otp', signinValidation, userController.sendOtp)
router.post('/auth/verify-otp', userController.verifyOtp)

router.post('/auth/signup', 
    signupValidation,
    userController.signup
);

router.post('/auth/signin', signinValidation, userController.signin)

router.post('/auth/forgot-password/verify-email', userController.sendOtpForgotPassowrd)

router.post("/auth/forgot-password/verify-otp" , userController.verifyOtpForgotPassword)

router.patch("/auth/reset-password", userController.resetPassword)


router.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/signin', failureMessage: 'Authentication failed' }),
    userController.googleCallback
  );




router.use(errors());

export default router; 