
import express from "express";
import { UserModel } from "../../models/User";
import UserRepository from "../../repositories/UserRepository";
import UserAuthService from "../../services/user/UserAuthService";
import OtpService from "../../services/OtpService";
import CacheService from "../../services/CacheService";
import UserAuthController from "../../controllers/user/UserAuthController";
import { validateUser } from "../../validators/userValidator";
import { signinValidation } from "../../validators/signInValidator";
import { errors } from 'celebrate';
import { authenticate } from "../../middlewares/authenticate";

const router = express.Router();
 
const userRepository = new UserRepository(UserModel); 
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