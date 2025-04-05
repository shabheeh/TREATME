import express from "express";
import multer from "multer";
import { validateSpecialization } from "../../validators/specializationValidator";
import { authenticate, authorize } from "../../middlewares/auth";
import { isUserActive } from "../../middlewares/checkUserStatus";
import TokenController from "../../controllers/shared/tokenController";
import { checkUserStatus } from "../../controllers/shared/userStatusController";
import { container } from "../../configs/container";
import { IReviewController } from "../../interfaces/IReview";
import { TYPES } from "../../types/inversifyjs.types";
import { ISpecializationController } from "src/interfaces/ISpecilazation";
import { IPatientAuthService } from "src/interfaces/IPatient";
import { IDoctorAuthService } from "src/interfaces/IDoctor";
import { IHealthHistoryController } from "src/interfaces/IHealthHistory";
import { ILifestyleController } from "src/interfaces/ILifestyle";
import { IBehaviouralHealthController } from "src/interfaces/IBehaviouralHealth";
import { INotificationController } from "src/controllers/notification/interface/INotificationController";
import { IWalletController } from "src/controllers/wallet/interface/IWalletController";
import { IAppointmentController } from "src/interfaces/IAppointment";
import { IStripeController } from "src/controllers/stripe/interface/IStripeController";
import IDashboardController from "src/controllers/dashboard/interface/IDashboardController";
import IAIChatController from "src/controllers/aiChat/interface/IAIChatController";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const tokenController = new TokenController();

const specializationController = container.get<ISpecializationController>(
  TYPES.ISpecializationController
);

const patientAuthService = container.get<IPatientAuthService>(
  TYPES.IPatientAuthService
);

const doctorAuthService = container.get<IDoctorAuthService>(
  TYPES.IDoctorAuthService
);

const healthHistoryController = container.get<IHealthHistoryController>(
  TYPES.IHealthHistoryController
);

const lifestyleController = container.get<ILifestyleController>(
  TYPES.ILifestyleController
);

const behaviouralHealController = container.get<IBehaviouralHealthController>(
  TYPES.IBehaviouralHealthController
);

const notificationController = container.get<INotificationController>(
  TYPES.INotificationController
);

const walletController = container.get<IWalletController>(
  TYPES.IWalletController
);

const appointmentController = container.get<IAppointmentController>(
  TYPES.IAppointmentController
);

const reviewController = container.get<IReviewController>(
  TYPES.IReviewController
);

const stripeController = container.get<IStripeController>(
  TYPES.IStripeController
);

const dashboardController = container.get<IDashboardController>(
  TYPES.IDashboardController
);

const aiChatController = container.get<IAIChatController>(
  TYPES.IAIChatController
);

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

router.patch(
  "/appointments/:appointmentId",
  authenticate,
  isUserActive(patientAuthService, doctorAuthService),
  authorize("patient", "doctor"),
  appointmentController.updateAppointmentStatus
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
