import express from "express";
import multer from "multer";
import ApplicantController from "../../controllers/applicant/applicantController";
import { ApplicantModel } from "../../models/Applicant";
import ApplicantRepository from "../../repositories/doctor/ApplicantRepository";
import ApplicantService from "../../services/applicant/applicantService";
import { authenticate, authorize } from "../../middlewares/auth";
import DoctorRepository from "../../repositories/doctor/DoctorRepository";
import { DoctorModel } from "../../models/Doctor";
import DoctorAuthService from "../../services/doctor/authService";
import DoctorAuthController from "../../controllers/doctor/authController";
import { signinValidation } from "../../validators/signInValidator";
import { validateApplicant } from "../../validators/applicantValidator";
import { convertFormData } from "../../middlewares/convertFormData";
import { isUserActive } from "../../middlewares/checkUserStatus";
import { PatientModel } from "../../models/Patient";
import PatientAuthService from "../../services/patient/authService";
import PatientRepository from "../../repositories/patient/PatientRepository";
import CacheService from "../../services/CacheService";
import OtpService from "../../services/OtpService";
import ScheduleRepository from "../../repositories/doctor/ScheduleRepository";
import { ScheduleModel } from "../../models/Schedule";
import ScheduleService from "../../services/doctor/scheduleService.ts";
import ScheduleController from "../../controllers/doctor/scheduleController";
import DoctorService from "../../services/doctor/doctorService";
import DoctorController from "../../controllers/doctor/doctorController";

// applicant di
const applicantRepository = new ApplicantRepository(ApplicantModel);
const applicantService = new ApplicantService(applicantRepository);
const applicantController = new ApplicantController(applicantService);

// doctor auth di
const doctorRepository = new DoctorRepository(DoctorModel);
const doctorAuthService = new DoctorAuthService(doctorRepository);
const doctorAuthController = new DoctorAuthController(doctorAuthService);

// patient di for middleware
const patientRepository = new PatientRepository(PatientModel);
const cacheService = new CacheService();
const otpService = new OtpService(cacheService);
const patientAuthService = new PatientAuthService(
  patientRepository,
  otpService,
  cacheService
);

// schedule di
const scheduleRepository = new ScheduleRepository(ScheduleModel);
const scheduleService = new ScheduleService(scheduleRepository);
const scheduleController = new ScheduleController(scheduleService);

// doctor di common
const doctorService = new DoctorService(doctorRepository);
const doctorController = new DoctorController(doctorService);

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
  convertFormData,
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

export default router;
