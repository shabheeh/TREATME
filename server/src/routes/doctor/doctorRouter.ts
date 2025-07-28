import express from "express";
import multer from "multer";
import { authenticate, authorize } from "../../middlewares/auth";
import { signinValidation } from "../../validators/signInValidator";
import { validateApplicant } from "../../validators/applicantValidator";
import { isUserActive } from "../../middlewares/checkUserStatus";
import { container } from "../../configs/container";
import { IApplicantController } from "src/interfaces/IApplicant";
import { TYPES } from "../../types/inversifyjs.types";
import { IPatientAuthService } from "src/interfaces/IPatient";
import { IScheduleController } from "src/interfaces/ISchedule";
import {
  IDoctorAuthController,
  IDoctorAuthService,
  IDoctorController,
} from "src/interfaces/IDoctor";

const applicantController = container.get<IApplicantController>(
  TYPES.IApplicantController
);

const doctorAuthController = container.get<IDoctorAuthController>(
  TYPES.IDoctorAuthController
);

const patientAuthService = container.get<IPatientAuthService>(
  TYPES.IPatientAuthService
);

const doctorAuthService = container.get<IDoctorAuthService>(
  TYPES.IDoctorAuthService
);

const scheduleController = container.get<IScheduleController>(
  TYPES.IScheduleController
);
const doctorController = container.get<IDoctorController>(
  TYPES.IDoctorController
);

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const authenticateAndCheckStatus = [
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
];

router.post(
  "/applicants",
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  validateApplicant,
  applicantController.createApplicant
);

router.get(
  "/applicants",
  authenticate,
  authorize("admin"),
  applicantController.getApplicants
);
router.get(
  "/applicants/:applicantId",
  authenticate,
  authorize("admin"),
  applicantController.getApplicant
);
router.delete(
  "/applicants/:applicantId",
  authenticate,
  authorize("admin"),
  applicantController.deleteApplicant
);

router.post("/auth/signin", signinValidation, doctorAuthController.signIn);
router.post("/auth/signout", doctorAuthController.signOut);
router.patch(
  "/password",
  [...authenticateAndCheckStatus, authorize("doctor")],
  doctorAuthController.changePassword
);

router.get(
  "/schedules/:doctorId",
  authenticateAndCheckStatus,
  scheduleController.getSchedule
);

router.patch(
  "/schedules/:doctorId",
  [...authenticateAndCheckStatus, authorize("doctor")],
  scheduleController.updateSchedule
);

router.get(
  "/doctors/schedules",
  authenticateAndCheckStatus,
  doctorController.getDoctorsWithSchedules
);

router.get(
  "/doctors/:doctorId",
  authenticateAndCheckStatus,
  doctorController.getDoctor
);

router.get(
  "/:doctorId/schedules",
  authenticateAndCheckStatus,
  scheduleController.getSchedule
);

router.get("/doctors", authenticateAndCheckStatus, doctorController.getDoctors);

router.post(
  "/:doctorId/slots",
  authenticateAndCheckStatus,
  scheduleController.addTimeSlot
);

router.delete(
  "/:doctorId/slots",
  authenticateAndCheckStatus,
  scheduleController.removeTimeSlot
);

router.post(
  "/:doctorId/bulk-update",
  authenticateAndCheckStatus,
  scheduleController.bulkUpdateSlots
);

export default router;
