import express from "express";
import multer from "multer";
import SpecializationRepository from "../../repositories/specialization/SpecializationRepository";
import { SpecializationModel } from "../../models/Specialization";
import SpecializationService from "../../services/specialization/sepecializationService";
import SpecializationController from "../../controllers/specialization/specializationController";
import { validateSpecialization } from "../../validators/specializationValidator";
import { authenticate, authorize } from "../../middlewares/auth";
import { isUserActive } from "../../middlewares/checkUserStatus";
import PatientRepository from "../../repositories/patient/PatientRepository";
import { PatientModel } from "../../models/Patient";
import PatientAuthService from "../../services/patient/authService";
import OtpService from "../../services/OtpService";
import CacheService from "../../services/CacheService";
import TokenController from "../../controllers/shared/tokenController";
import { checkUserStatus } from "../../controllers/shared/userStatusController";
import DoctorRepository from "../../repositories/doctor/DoctorRepository";
import { DoctorModel } from "../../models/Doctor";
import DoctorAuthService from "../../services/doctor/authService";
import HealthHistoryRepository from "../../repositories/healthProfile/HealthHistoryRepository";
import { HealthHistoryModel } from "../../models/HealthHistory";
import HealthHistoryService from "../../services/healthProfile/HealthHistoryService";
import HealthHistoryController from "../../controllers/healthProfile/healthHistoryController";
import LifestyleRepository from "../../repositories/healthProfile/LifestyleRepository";
import { LifestyleModel } from "../../models/Lifestyle";
import LifestyleService from "../../services/healthProfile/LifestyleService";
import LifestyleController from "../../controllers/healthProfile/lifestyleController";
import BehaviouralHealthRepository from "../../repositories/healthProfile/BehaviouralHealthRepository";
import { BehaviouralHealthModel } from "../../models/BehaviouralHealth";
import BehaviouralHealthService from "../../services/healthProfile/BehaviouralHealthService";
import BehaviouralHealthController from "../../controllers/healthProfile/behaviouralHealthController";
import AppointmentRepository from "../../repositories/appointment/AppointmentRepository";
import { AppointmentModel } from "../../models/Appointment";
import AppointmentController from "../../controllers/appointment/appointmentController";
import AppointmentService from "../../services/appointment/appointmentService";
import ScheduleRepository from "../../repositories/doctor/ScheduleRepository";
import { ScheduleModel } from "../../models/Schedule";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const tokenController = new TokenController();

// speicailization di-(dipendency injection)
const specializationRepository = new SpecializationRepository(
  SpecializationModel
);
const specializationService = new SpecializationService(
  specializationRepository
);
const specializationController = new SpecializationController(
  specializationService
);

// patient auth di
const patientRepository = new PatientRepository(PatientModel);
const cacheService = new CacheService();
const otpService = new OtpService(cacheService);
const patientAuthService = new PatientAuthService(
  patientRepository,
  otpService,
  cacheService
);

// doctor auth di
const doctorRepository = new DoctorRepository(DoctorModel);
const doctorAuthService = new DoctorAuthService(doctorRepository);

// health history di
const healthHistoryRepository = new HealthHistoryRepository(HealthHistoryModel);
const healthHistoryService = new HealthHistoryService(healthHistoryRepository);
const healthHistoryController = new HealthHistoryController(
  healthHistoryService
);

// lifestyle di
const lifestyleRepository = new LifestyleRepository(LifestyleModel);
const lifestyleService = new LifestyleService(lifestyleRepository);
const lifestyleController = new LifestyleController(lifestyleService);

// behavioural health di
const behaviouralHealthRepository = new BehaviouralHealthRepository(
  BehaviouralHealthModel
);
const behavioralHealthService = new BehaviouralHealthService(
  behaviouralHealthRepository
);
const behaviouralHealController = new BehaviouralHealthController(
  behavioralHealthService
);

const scheduleRepository = new ScheduleRepository(ScheduleModel);

const appointmentRepository = new AppointmentRepository(AppointmentModel);
const appointmentService = new AppointmentService(
  appointmentRepository,
  scheduleRepository
);
const appointmentController = new AppointmentController(appointmentService);

router.post("/auth/refresh-token", tokenController.handleRefreshToken);

router.get(
  "/auth/status",
  authenticate,
  checkUserStatus(patientAuthService, doctorAuthService)
);

router.post(
  "/specializations",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  validateSpecialization,
  specializationController.createSpecialization
);
router.get(
  "/specializations",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  specializationController.getSpecializations
);
router.get(
  "/specializations/public",
  specializationController.getSpecializations
);
router.get(
  "/specializations/:specializationId",
  authenticate,
  specializationController.getSpecializationById
);
router.put(
  "/specializations/:specializationId",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  specializationController.updateSpecialization
);

router.get(
  "/health-history/:patientId",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  authorize("patient"),
  healthHistoryController.getHealthHistory
);

router.patch(
  "/health-history/:patientId",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  authorize("patient"),
  healthHistoryController.updateHealthHistory
);

router.get(
  "/lifestyle/:patientId",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  authorize("patient"),
  lifestyleController.getLifestyle
);

router.patch(
  "/lifestyle/:patientId",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  authorize("patient"),
  lifestyleController.updateLifestyle
);

router.get(
  "/behavioural-health/:patientId",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  authorize("patient"),
  behaviouralHealController.getBehaviuoralHealth
);

router.patch(
  "/behavioural-health/:patientId",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  authorize("patient"),
  behaviouralHealController.updateBehavouralHealth
);

router.post(
  "/appointments",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  authorize("patient", "doctor"),
  appointmentController.createAppointment
);

router.get(
  "/appointment/:appointmentId",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  appointmentController.getAppointmentById
);

router.put(
  "/appointments/:appointmentId",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  authorize("patient", "doctor"),
  appointmentController.updateAppointment
);

router.get(
  "/appointments/:userId",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  authorize("patient", "doctor"),
  appointmentController.getAppointmentsByUserId
);

router.get(
  "/appointments",
  authenticate,
  authorize("admin"),
  appointmentController.getAppointments
);

export default router;
