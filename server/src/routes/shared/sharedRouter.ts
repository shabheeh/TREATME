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
import ReviewRepository from "../../repositories/review/reviewRepository";
import { ReviewModel } from "../../models/Review";
import ReviewService from "../../services/review/reviewService";
import ReviewController from "../../controllers/review/reviewController";
import NotificationRepository from "../../repositories/notification/NotificationRepository";
import { NotificationModel } from "../../models/Notification";
import NotificationService from "../../services/notification/NotificationService";
import NotificationController from "../../controllers/notification/NotificationController";
import WalletRepository from "../../repositories/wallet/WalletRepository";
import { TransactionModel, WalletModel } from "../../models/Wallet";
import WalletService from "../../services/wallet/WalletService";
import WalletController from "../../controllers/wallet/WalletController";
import StripeService from "../../services/stripe/StripeService";
import StripeController from "../../controllers/stripe/StripeController";
import ScheduleService from "../../services/doctor/scheduleService.ts";
import DashboardService from "../../services/dashboard/DashboardService";
import DependentRepository from "../../repositories/patient/DependentRepository";
import DashboardController from "../../controllers/dashboard/DashboardController";
import { DependentModel } from "../../models/Dependent";
import AIChatRepository from "../../repositories/aiChat/AIChatRepository";
import AIChatService from "../../services/aiChat/AIChatService";
import AIChatController from "../../controllers/aiChat/AIChatController";

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

const notificationRepository = new NotificationRepository(NotificationModel);
const notificationService = new NotificationService(
  notificationRepository
  // socketService
);

const notificationController = new NotificationController(notificationService);

// appointment di
const scheduleRepository = new ScheduleRepository(ScheduleModel);
const scheduleService = new ScheduleService(scheduleRepository);

// wallet
const walletRepository = new WalletRepository(WalletModel, TransactionModel);
const walletService = new WalletService(walletRepository);
const walletController = new WalletController(walletService);

const appointmentRepository = new AppointmentRepository(AppointmentModel);
const appointmentService = new AppointmentService(
  appointmentRepository,
  scheduleService,
  notificationService,
  walletService
);
const appointmentController = new AppointmentController(appointmentService);

// reviews di
const reviewRepository = new ReviewRepository(ReviewModel);
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

// stripe
const stripeService = new StripeService(appointmentService, walletService);
const stripeController = new StripeController(stripeService);

const dependentRepository = new DependentRepository(DependentModel);

// dashboard
const dashboardService = new DashboardService(
  appointmentRepository,
  patientRepository,
  dependentRepository,
  doctorRepository,
  reviewRepository
);
const dashboardController = new DashboardController(dashboardService);

// ai chat bot
const aiChatRepository = new AIChatRepository();
const aiChatService = new AIChatService(aiChatRepository);
const aiChatController = new AIChatController(aiChatService);

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

router.get(
  "/appointments",
  authenticate,
  authorize("admin"),
  appointmentController.getAppointments
);

router.post(
  "/appointments",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  authorize("patient", "doctor"),
  appointmentController.createAppointment
);

router.get(
  "/appointments/patients",
  authenticate,
  authorize("doctor"),
  appointmentController.getPatientsForDoctor
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

router.post(
  "/create-payment-intent",
  authenticate,
  stripeController.createPaymentIntent
);

router.post("/webhooks", stripeController.handleWebhook);

router.get(
  "/appointment/payment/:paymentId",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  appointmentController.getAppointmentByPaymentId
);

router.post(
  "/reviews",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  authorize("patient"),
  reviewController.addOrUpdateReview
);

router.get(
  "/reviews/:doctorId",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  reviewController.getDoctorReviews
);

router.get(
  "/notifications",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  notificationController.getNotfications
);

router.patch(
  "/notifications",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  notificationController.markAllNotificationRead
);

router.get(
  "/notifications/count",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  notificationController.getUnreadNotificationsCount
);

router.get(
  "/wallet",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  walletController.accessWallet
);

router.post(
  "/wallet",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  walletController.createWithdrawalRequest
);

router.patch(
  "/wallet",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  walletController.updateTransaction
);

router.get(
  "/dashboard",
  authenticate,
  authorize("admin"),
  dashboardController.getAdminDashboardData
);

router.get(
  "/dashboard/doctor",
  authenticate,
  authorize("doctor"),
  dashboardController.getDoctorDashboardData
);

router.post("/ai", authenticate, aiChatController.handleAIChatInteraction);

export default router;
