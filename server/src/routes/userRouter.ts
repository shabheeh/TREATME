// src/routes/userRoutes.ts
import express from "express";
import UserRepository from "../repositories/UserRepository";
import UserService from "../services/UserService";
import OtpService from "../services/OptService";
import UserController from "../controllers/UserController";
import { signupValidation, signinValidation } from "../validators/userValidator";
import { errors } from 'celebrate';

const router = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const otpService = new OtpService()
const userController = new UserController(userService, otpService);


router.post('/signup', 
    signupValidation,
    userController.signup
);


router.post('/signin', signinValidation, userController.signin)

router.post('/verify-otp', userController.verifyOtp)



router.use(errors());

export default router; 