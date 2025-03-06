import express from "express";
import multer from "multer";
import { PatientModel } from "../../models/Patient";
import PatientRepository from "../../repositories/patient/PatientRepository";
import PatientAuthService from "../../services/patient/authService";
import OtpService from "../../services/OtpService";
import CacheService from "../../services/CacheService";
import PatientAuthController from "../../controllers/patient/PatientAuthController";
import { validateUser } from "../../validators/userValidator";
import { signinValidation } from "../../validators/signInValidator";
import { errors } from "celebrate";
import { authenticate, authorize } from "../../middlewares/auth";
import PatientAcccountService from "../../services/patient/accountService";
import PatientAcccountController from "../../controllers/patient/patientAccountController";
import { isUserActive } from "../../middlewares/checkUserStatus";
import DependentRepository from "../../repositories/patient/DependentRepository";
import { DependentModel } from "../../models/Dependent";
import DependentService from "../../services/dependent/dependentService";
import DependentController from "../../controllers/dependent/dependentController";
import DoctorRepository from "../../repositories/doctor/DoctorRepository";
import { DoctorModel } from "../../models/Doctor";
import DoctorAuthService from "../../services/doctor/authService";
import HealthHistoryRepository from "../../repositories/healthProfile/HealthHistoryRepository";
import { HealthHistoryModel } from "../../models/HealthHistory";
import BehaviouralHealthRepository from "../../repositories/healthProfile/BehaviouralHealthRepository";
import { BehaviouralHealthModel } from "../../models/BehaviouralHealth";
import LifestyleRepository from "../../repositories/healthProfile/LifestyleRepository";
import { LifestyleModel } from "../../models/Lifestyle";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// patient auth di-(dipendency injection)
const patientRepository = new PatientRepository(PatientModel);
const cacheService = new CacheService();
const otpService = new OtpService(cacheService);
const patientAuthService = new PatientAuthService(
  patientRepository,
  otpService,
  cacheService
);
const patientAuthController = new PatientAuthController(
  patientAuthService,
  otpService
);

// patient account di
const healthHistoryRepository = new HealthHistoryRepository(HealthHistoryModel);
const behaviouralHealthRepository = new BehaviouralHealthRepository(
  BehaviouralHealthModel
);
const lifestyleRepository = new LifestyleRepository(LifestyleModel);
const patientAccountService = new PatientAcccountService(
  patientRepository,
  healthHistoryRepository,
  behaviouralHealthRepository,
  lifestyleRepository
);
const patientAccountController = new PatientAcccountController(
  patientAccountService
);

// dependent di
const dependentRepository = new DependentRepository(DependentModel);
const dependentService = new DependentService(dependentRepository);
const dependentController = new DependentController(dependentService);

// doctor di for middleware
const doctorRepository = new DoctorRepository(DoctorModel);
const doctorAuthService = new DoctorAuthService(doctorRepository);

// ---------------------------------------------------------------

const authenticateAndCheckStatus = [
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
];

router.post("/auth/send-otp", signinValidation, patientAuthController.sendOtp);
router.post("/auth/verify-otp", patientAuthController.verifyOtp);

router.post("/auth/signup", validateUser, patientAuthController.signup);

router.post("/auth/signin", signinValidation, patientAuthController.signin);
router.post(
  "/auth/forgot-password/verify-email",
  patientAuthController.sendOtpForgotPassowrd
);
router.post(
  "/auth/forgot-password/verify-otp",
  patientAuthController.verifyOtpForgotPassword
);
router.patch("/auth/reset-password", patientAuthController.resetPassword);
router.post("/auth/google", patientAuthController.googleSignIn);
router.post("/auth/complete-profile", patientAuthController.completeProfile);
router.post("/auth/resend-otp", patientAuthController.resendOtp);
router.post(
  "/auth/forgot-password/resend-otp",
  patientAuthController.resendOtpForgotPassword
);
router.post("/auth/signout", patientAuthController.signOut);

router.put(
  "/profile",
  [
    ...authenticateAndCheckStatus,
    authorize("patient"),
    upload.single("profilePicture"),
  ],
  patientAccountController.updateProfile
);

router.post(
  "/dependents",
  [
    ...authenticateAndCheckStatus,
    authorize("patient"),
    upload.single("profilePicture"),
  ],
  dependentController.createDependent
);

router.get(
  "/dependents/:id",
  [...authenticateAndCheckStatus, authorize("patient")],
  dependentController.getDependents
);

router.put(
  "/dependents/:id",
  [
    ...authenticateAndCheckStatus,
    authorize("patient"),
    upload.single("profilePicture"),
  ],
  dependentController.updateDependent
);

router.delete(
  "/dependents/:id",
  [...authenticateAndCheckStatus, authorize("patient")],
  dependentController.deleteDependent
);

router.get(
  "/health/:id",
  [...authenticateAndCheckStatus, authorize("doctor")],
  patientAccountController.getHealthProfile
);

router.use(errors());

export default router;
