// src/routes/userRoutes.ts
import express from "express";
import UserRepository from "../repositories/UserRepository";
import UserService from "../services/UserService";
import OtpService from "../services/OptService";
import CacheService from "../services/CacheService";
import UserController from "../controllers/UserController";
import { signupValidation, signinValidation } from "../validators/userValidator";
import { errors } from 'celebrate';

const router = express.Router();

const userRepository = new UserRepository();
const cacheService = new CacheService()
const otpService = new OtpService(cacheService)
const userService = new UserService(userRepository, otpService, cacheService);
const userController = new UserController(userService, otpService);


router.post('/send-otp', signinValidation, userController.sendOtp)
router.post('/verify-otp', userController.verifyOtp)

router.post('/signup', 
    signupValidation,
    userController.signup
);

router.post('/signin', signinValidation, userController.signin)




router.use(errors());

export default router; 