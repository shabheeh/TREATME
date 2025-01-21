
import express from "express";
import { PatientModel } from "../../models/Patient";
import UserRepository from "../../repositories/PatientRepository";
import UserAuthService from "../../services/patient/authService";
import OtpService from "../../services/OtpService";
import CacheService from "../../services/CacheService";
import UserAuthController from "../../controllers/patient/PatientAuthController";
import { validateUser } from "../../validators/userValidator";
import { signinValidation } from "../../validators/signInValidator";
import { errors } from 'celebrate';
import { authenticate } from "../../middlewares/auth";

const router = express.Router();
 
const userRepository = new UserRepository(PatientModel); 
const cacheService = new CacheService()
const otpService = new OtpService(cacheService)
const userAuthService = new UserAuthService(userRepository, otpService, cacheService);
const userAuthController = new UserAuthController(userAuthService, otpService);


router.post('/auth/send-otp', signinValidation, userAuthController.sendOtp)
router.post('/auth/verify-otp', userAuthController.verifyOtp)

router.post('/auth/signup', 
    validateUser,
    userAuthController.signup
);

router.post('/auth/signin', signinValidation, userAuthController.signin)

router.post('/auth/forgot-password/verify-email', userAuthController.sendOtpForgotPassowrd)

router.post("/auth/forgot-password/verify-otp" , userAuthController.verifyOtpForgotPassword)

router.put("/auth/reset-password", userAuthController.resetPassword)

router.post("/auth/google", userAuthController.googleSignIn)

router.post("/auth/complete-profile", authenticate, userAuthController.completeProfile)

router.post('/auth/resend-otp', userAuthController.resendOtp)

router.post('/auth/forgot-password/resend-otp', userAuthController.resendOtpForgotPassword)

router.post('/auth/signout', userAuthController.signOUt)

router.use(errors());

export default router; 