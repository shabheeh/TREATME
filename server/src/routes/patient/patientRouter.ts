import express from "express";
import multer from "multer";
import { validateUser } from "../../validators/userValidator";
import { signinValidation } from "../../validators/signInValidator";
import { errors } from "celebrate";
import { authenticate, authorize } from "../../middlewares/auth";
import { isUserActive } from "../../middlewares/checkUserStatus";
import { container } from "../../configs/container";
import {
  IPatientAccountController,
  IPatientAuthController,
  IPatientAuthService,
} from "src/interfaces/IPatient";
import { TYPES } from "../../types/inversifyjs.types";
import { IDependentController } from "src/interfaces/IDependent";
import { IDoctorAuthService } from "src/interfaces/IDoctor";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const patientAuthService = container.get<IPatientAuthService>(
  TYPES.IPatientAuthService
);
const patientAuthController = container.get<IPatientAuthController>(
  TYPES.IPatientAuthController
);

const patientAccountController = container.get<IPatientAccountController>(
  TYPES.IPatientAcccountController
);

const dependentController = container.get<IDependentController>(
  TYPES.IDependentController
);

const doctorAuthService = container.get<IDoctorAuthService>(
  TYPES.IDoctorAuthService
);

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
router.patch(
  "/auth/change-password",
  [...authenticateAndCheckStatus, authorize("patient")],
  patientAuthController.changePassword
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
