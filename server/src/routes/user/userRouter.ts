
import express from "express";
import { UserModel } from "../../models/User";
import UserRepository from "../../repositories/UserRepository";
import UserAuthService from "../../services/user/UserAuthService";
import OtpService from "../../services/OtpService";
import CacheService from "../../services/CacheService";
import UserAuthController from "../../controllers/user/UserAuthController";
import { signupValidation } from "../../validators/userValidator";
import { signinValidation } from "../../validators/signInValidator";
import { errors } from 'celebrate';
import { authenticateToken } from "../../middlewares/authMiddleware";

const router = express.Router();

const userRepository = new UserRepository(UserModel); 
const cacheService = new CacheService()
const otpService = new OtpService(cacheService)
const userAuthService = new UserAuthService(userRepository, otpService, cacheService);
const userAuthController = new UserAuthController(userAuthService, otpService);


router.post('/auth/send-otp', signinValidation, userAuthController.sendOtp)
router.post('/auth/verify-otp', userAuthController.verifyOtp)

router.post('/auth/signup', 
    signupValidation,
    userAuthController.signup
);

router.post('/auth/signin', signinValidation, userAuthController.signin)

router.post('/auth/forgot-password/verify-email', userAuthController.sendOtpForgotPassowrd)

router.post("/auth/forgot-password/verify-otp" , userAuthController.verifyOtpForgotPassword)

router.put("/auth/reset-password", userAuthController.resetPassword)

router.post("/auth/google", userAuthController.googleSignIn)

router.post("/auth/complete-profile", authenticateToken, userAuthController.completeProfile)


router.use(errors());

export default router; 