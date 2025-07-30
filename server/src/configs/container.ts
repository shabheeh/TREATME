import { Container } from "inversify";
import { Model } from "mongoose";
import ReviewController from "../controllers/review/reviewController";
import IReview, {
  IReviewController,
  IReviewService,
} from "../interfaces/IReview";
import { ReviewModel } from "../models/Review";
import IReviewRepository from "../repositories/review/interface/IReviewRepository";
import ReviewRepository from "../repositories/review/reviewRepository";
import ReviewService from "../services/review/reviewService";
import { TYPES } from "../types/inversifyjs.types";
import IPatient, {
  IPatientAccountController,
  IPatientAccountService,
  IPatientAuthController,
  IPatientAuthService,
} from "../interfaces/IPatient";
import { PatientModel } from "../models/Patient";
import IDependent, {
  IDependentController,
  IDependentService,
} from "../interfaces/IDependent";
import { DependentModel } from "../models/Dependent";
import IAdmin, {
  IAdminAuthController,
  IAdminAuthService,
  IAdminDoctorController,
  IAdminDoctorService,
  IAdminPatientsController,
  IAdminPatientsService,
} from "../interfaces/IAdmin";
import { AdminModel } from "../models/Admin";
import IDoctor, {
  IDoctorAuthController,
  IDoctorAuthService,
  IDoctorController,
  IDoctorService,
} from "../interfaces/IDoctor";
import { DoctorModel } from "../models/Doctor";
import {
  IApplicant,
  IApplicantController,
  IApplicantService,
} from "../interfaces/IApplicant";
import { ApplicantModel } from "../models/Applicant";
import {
  IAppointment,
  IAppointmentController,
  IAppointmentService,
} from "../interfaces/IAppointment";
import { AppointmentModel } from "../models/Appointment";
import {
  IHealthHistory,
  IHealthHistoryController,
  IHealthHistoryService,
} from "../interfaces/IHealthHistory";
import { HealthHistoryModel } from "../models/HealthHistory";
import {
  IBehaviouralHealth,
  IBehaviouralHealthController,
  IBehaviouralHealthService,
} from "../interfaces/IBehaviouralHealth";
import { BehaviouralHealthModel } from "../models/BehaviouralHealth";
import {
  ILifestyle,
  ILifestyleController,
  ILifestyleService,
} from "../interfaces/ILifestyle";
import { LifestyleModel } from "../models/Lifestyle";
import { IChat } from "../interfaces/IChat";
import { ChatModel } from "../models/Chat";
import { IMessage } from "../interfaces/IMessage";
import { MessageModel } from "../models/Message";
import ISpecialization, {
  ISpecializationController,
  ISpecializationService,
} from "../interfaces/ISpecilazation";
import { SpecializationModel } from "../models/Specialization";
import {
  ISchedule,
  IScheduleController,
  IScheduleService,
} from "../interfaces/ISchedule";
import { ScheduleModel } from "../models/Schedule";
import { ITransaction, IWallet } from "../interfaces/IWallet";
import { TransactionModel, WalletModel } from "../models/Wallet";
import { INotification } from "../interfaces/INotification";
import { NotificationModel } from "../models/Notification";
import IAdminRepository from "../repositories/admin/interfaces/IAdminRepository";
import AdminRepository from "../repositories/admin/AdminRepository";
import IAppointmentRepository from "../repositories/appointment/interfaces/IAppointmentRepository";
import AppointmentRepository from "../repositories/appointment/AppointmentRepository";
import IDoctorRepository from "../repositories/doctor/interfaces/IDoctorRepository";
import DoctorRepository from "../repositories/doctor/DoctorRepository";
import IDependentRepository from "../repositories/patient/interface/IDependentRepository";
import DependentRepository from "../repositories/patient/DependentRepository";
import IPatientRepository from "../repositories/patient/interface/IPatientRepository";
import PatientRepository from "../repositories/patient/PatientRepository";
import IApplicantRepository from "../repositories/doctor/interfaces/IApplicantRepository";
import ApplicantRepository from "../repositories/doctor/ApplicantRepository";
import IScheduleRepository from "../repositories/doctor/interfaces/IScheduleRepository";
import ScheduleRepository from "../repositories/doctor/ScheduleRepository";
import ISpecializationRepository from "../repositories/specialization/interfaces/ISpecializationRepository";
import SpecializationRepository from "../repositories/specialization/SpecializationRepository";
import IHealthHistoryRepository from "../repositories/healthProfile/interface/IHealthHistoryRepository";
import HealthHistoryRepository from "../repositories/healthProfile/HealthHistoryRepository";
import IBehaviouralHealthRepository from "../repositories/healthProfile/interface/IBehaviouralHealthRepository";
import BehaviouralHealthRepository from "../repositories/healthProfile/BehaviouralHealthRepository";
import ILifestyleRepository from "../repositories/healthProfile/interface/ILifestyleRepository";
import LifestyleRepository from "../repositories/healthProfile/LifestyleRepository";
import IChatRepository from "../repositories/chat/interfaces/IChatRepository";
import ChatRepository from "../repositories/chat/ChatRepository";
import IMessageRepository from "../repositories/chat/interfaces/IMessageRepository";
import MessageRepository from "../repositories/chat/MessageRepository";
import INotificationRepository from "../repositories/notification/interface/INotificationRepository";
import NotificationRepository from "../repositories/notification/NotificationRepository";
import IWalletRepository from "../repositories/wallet/interface/IWalletRepository";
import WalletRepository from "../repositories/wallet/WalletRepository";
import AdminAuthService from "../services/admin/AdminAuthService";
import AdminDoctorService from "../services/admin/adminDoctorService";
import AdminPatientsService from "../services/admin/adminPatientsService";
import ApplicantService from "../services/applicant/applicantService";
import AppointmentService from "../services/appointment/appointmentService";
import PatientAuthService from "../services/patient/authService";
import PatientAcccountService from "../services/patient/accountService";
import DependentService from "../services/dependent/dependentService";
import DoctorAuthService from "../services/doctor/authService";
import DoctorService from "../services/doctor/doctorService";
import ScheduleService from "../services/doctor/scheduleService.ts";
import SpecializationService from "../services/specialization/sepecializationService";
import HealthHistoryService from "../services/healthProfile/HealthHistoryService";
import BehaviouralHealthService from "../services/healthProfile/BehaviouralHealthService";
import LifestyleService from "../services/healthProfile/LifestyleService";
import { INotificationService } from "../services/notification/interface/INotificationService";
import NotificationService from "../services/notification/NotificationService";
import { IStripeService } from "../services/stripe/interface/IStripeService";
import StripeService from "../services/stripe/StripeService";
import { IChatService } from "../services/chat/interface/IChatService";
import ChatService from "../services/chat/ChatService";
import IDashboardService from "../services/dashboard/interface/IDashboardService";
import DashboardService from "../services/dashboard/DashboardService";
import { IWalletService } from "../services/wallet/interface/IWalletService";
import WalletService from "../services/wallet/WalletService";
import AdminAuthController from "../controllers/admin/adminAuthController";
import AdminDoctorController from "../controllers/admin/adminDoctorController";
import AdminPatientsController from "../controllers/admin/adminPatientsController";
import ApplicantController from "../controllers/applicant/applicantController";
import PatientAuthController from "../controllers/patient/PatientAuthController";
import PatientAcccountController from "../controllers/patient/patientAccountController";
import DependentController from "../controllers/dependent/dependentController";
import HealthHistoryController from "../controllers/healthProfile/healthHistoryController";
import BehaviouralHealthController from "../controllers/healthProfile/behaviouralHealthController";
import LifestyleController from "../controllers/healthProfile/lifestyleController";
import DoctorAuthController from "../controllers/doctor/authController";
import DoctorController from "../controllers/doctor/doctorController";
import SpecializationController from "../controllers/specialization/specializationController";
import ScheduleController from "../controllers/doctor/scheduleController";
import { IChatController } from "../controllers/chat/interface/IChatController";
import ChatController from "../controllers/chat/ChatController";
import { IWalletController } from "../controllers/wallet/interface/IWalletController";
import WalletController from "../controllers/wallet/WalletController";
import { IStripeController } from "../controllers/stripe/interface/IStripeController";
import StripeController from "../controllers/stripe/StripeController";
import { INotificationController } from "../controllers/notification/interface/INotificationController";
import NotificationController from "../controllers/notification/NotificationController";
import IDashboardController from "../controllers/dashboard/interface/IDashboardController";
import DashboardController from "../controllers/dashboard/DashboardController";
import { ICacheService, IOtpService } from "../interfaces/IShared";
import OtpService from "../services/OtpService";
import CacheService from "../services/CacheService";
import AppointmentController from "../controllers/appointment/appointmentController";
import IAIChatRepository from "../repositories/aiChat/interface/IAIChatRepository";
import AIChatRepository from "../repositories/aiChat/AIChatRepository";
import IAIChatService from "../services/aiChat/interface/IAIChatService";
import AIChatService from "../services/aiChat/AIChatService";
import IAIChatController from "../controllers/aiChat/interface/IAIChatController";
import AIChatController from "../controllers/aiChat/AIChatController";
import { ISocketService, SocketService } from "../socket/socket";
import { IConsultation } from "../interfaces/IConsultation";
import { ConsultationModel } from "../models/Consultation";
import { IConsultationRepository } from "../repositories/consultations/interface/IConsultationRepository";
import ConsultationRepository from "../repositories/consultations/ConsultationRepository";
import { IConsultationService } from "../services/consultations/interface/IConsultationService";
import ConsultationService from "../services/consultations/ConsultationService";
import { IConsultationController } from "../controllers/consultation/interface/IConsultationController";
import ConsultationController from "../controllers/consultation/ConsultationController";

export const container = new Container();

// models
container
  .bind<Model<IPatient>>(TYPES.PatientModel)
  .toConstantValue(PatientModel);
container
  .bind<Model<IDependent>>(TYPES.DependentModel)
  .toConstantValue(DependentModel);
container.bind<Model<IAdmin>>(TYPES.AdminModel).toConstantValue(AdminModel);
container.bind<Model<IDoctor>>(TYPES.DoctorModel).toConstantValue(DoctorModel);
container
  .bind<Model<IApplicant>>(TYPES.ApplicantModel)
  .toConstantValue(ApplicantModel);
container
  .bind<Model<IAppointment>>(TYPES.AppointmentModel)
  .toConstantValue(AppointmentModel);
container
  .bind<Model<IHealthHistory>>(TYPES.HealthHistoryModel)
  .toConstantValue(HealthHistoryModel);
container
  .bind<Model<IBehaviouralHealth>>(TYPES.BehaviouralHealthModel)
  .toConstantValue(BehaviouralHealthModel);
container
  .bind<Model<ILifestyle>>(TYPES.LifestyleModel)
  .toConstantValue(LifestyleModel);
container.bind<Model<IChat>>(TYPES.ChatModel).toConstantValue(ChatModel);
container
  .bind<Model<IMessage>>(TYPES.MessageModel)
  .toConstantValue(MessageModel);
container
  .bind<Model<ISpecialization>>(TYPES.SpecializationModel)
  .toConstantValue(SpecializationModel);
container
  .bind<Model<ISchedule>>(TYPES.ScheduleModel)
  .toConstantValue(ScheduleModel);
container.bind<Model<IWallet>>(TYPES.WalletModel).toConstantValue(WalletModel);
container
  .bind<Model<ITransaction>>(TYPES.TransactionModel)
  .toConstantValue(TransactionModel);
container
  .bind<Model<INotification>>(TYPES.NotificationModel)
  .toConstantValue(NotificationModel);
container.bind<Model<IReview>>(TYPES.ReviewModel).toConstantValue(ReviewModel);
container
  .bind<Model<IConsultation>>(TYPES.ConsultationModel)
  .toConstantValue(ConsultationModel);

// repositories
container
  .bind<IPatientRepository>(TYPES.IPatientRepository)
  .to(PatientRepository);
container.bind<IAdminRepository>(TYPES.IAdminRepository).to(AdminRepository);
container
  .bind<IAppointmentRepository>(TYPES.IAppointmentRepository)
  .to(AppointmentRepository);
container.bind<IDoctorRepository>(TYPES.IDoctorRepository).to(DoctorRepository);
container
  .bind<IDependentRepository>(TYPES.IDependentRepository)
  .to(DependentRepository);
container
  .bind<IApplicantRepository>(TYPES.IApplicantRepository)
  .to(ApplicantRepository);
container
  .bind<IScheduleRepository>(TYPES.IScheduleRepository)
  .to(ScheduleRepository);
container
  .bind<ISpecializationRepository>(TYPES.ISpecializationRepository)
  .to(SpecializationRepository);
container
  .bind<IHealthHistoryRepository>(TYPES.IHealthHistoryRepository)
  .to(HealthHistoryRepository);
container
  .bind<IBehaviouralHealthRepository>(TYPES.IBehavouralHealthRepository)
  .to(BehaviouralHealthRepository);
container
  .bind<ILifestyleRepository>(TYPES.ILifestyleRepository)
  .to(LifestyleRepository);
container.bind<IChatRepository>(TYPES.IChatRepository).to(ChatRepository);
container
  .bind<IMessageRepository>(TYPES.IMessageRepository)
  .to(MessageRepository);
container
  .bind<INotificationRepository>(TYPES.INotificationRepository)
  .to(NotificationRepository);
container.bind<IWalletRepository>(TYPES.IWalletRepository).to(WalletRepository);
container.bind<IReviewRepository>(TYPES.IReviewRepository).to(ReviewRepository);
container.bind<IAIChatRepository>(TYPES.IAIChatRepository).to(AIChatRepository);
container
  .bind<IConsultationRepository>(TYPES.IConsultationRepository)
  .to(ConsultationRepository);

// services
container.bind<IAdminAuthService>(TYPES.IAdminAuthService).to(AdminAuthService);
container
  .bind<IAdminDoctorService>(TYPES.IAdminDoctorService)
  .to(AdminDoctorService);
container
  .bind<IAdminPatientsService>(TYPES.IAdminPatientsService)
  .to(AdminPatientsService);
container.bind<IApplicantService>(TYPES.IApplicantService).to(ApplicantService);
container
  .bind<IAppointmentService>(TYPES.IAppointmentService)
  .to(AppointmentService);
container
  .bind<IPatientAuthService>(TYPES.IPatientAuthService)
  .to(PatientAuthService);
container
  .bind<IPatientAccountService>(TYPES.IPatientAcccountService)
  .to(PatientAcccountService);
container.bind<IDependentService>(TYPES.IDependentService).to(DependentService);
container
  .bind<IDoctorAuthService>(TYPES.IDoctorAuthService)
  .to(DoctorAuthService);
container.bind<IDoctorService>(TYPES.IDoctorService).to(DoctorService);
container.bind<IScheduleService>(TYPES.IScheduleService).to(ScheduleService);
container
  .bind<ISpecializationService>(TYPES.ISpecializationService)
  .to(SpecializationService);
container
  .bind<IHealthHistoryService>(TYPES.IHealthHistoryService)
  .to(HealthHistoryService);
container
  .bind<IBehaviouralHealthService>(TYPES.IBehaviouralHealthService)
  .to(BehaviouralHealthService);
container.bind<ILifestyleService>(TYPES.ILifestyleService).to(LifestyleService);
container
  .bind<INotificationService>(TYPES.INotificationService)
  .to(NotificationService);
container.bind<IStripeService>(TYPES.IStripeService).to(StripeService);
container.bind<IChatService>(TYPES.IChatService).to(ChatService);
container.bind<IDashboardService>(TYPES.IDashboardService).to(DashboardService);
container.bind<IWalletService>(TYPES.IWalletService).to(WalletService);
container.bind<IReviewService>(TYPES.IReviewService).to(ReviewService);
container.bind<IOtpService>(TYPES.IOtpService).to(OtpService);
container.bind<ICacheService>(TYPES.ICacheService).to(CacheService);
container.bind<IAIChatService>(TYPES.IAIChatService).to(AIChatService);
container.bind<ISocketService>(TYPES.ISocketService).to(SocketService);
container
  .bind<IConsultationService>(TYPES.IConsultationService)
  .to(ConsultationService);

// controllers
container
  .bind<IAdminAuthController>(TYPES.IAdminAuthController)
  .to(AdminAuthController);
container
  .bind<IAdminDoctorController>(TYPES.IAdminDoctorController)
  .to(AdminDoctorController);
container
  .bind<IAdminPatientsController>(TYPES.IAdminPatientsController)
  .to(AdminPatientsController);
container
  .bind<IApplicantController>(TYPES.IApplicantController)
  .to(ApplicantController);
container
  .bind<IPatientAuthController>(TYPES.IPatientAuthController)
  .to(PatientAuthController);
container
  .bind<IPatientAccountController>(TYPES.IPatientAcccountController)
  .to(PatientAcccountController);
container
  .bind<IDependentController>(TYPES.IDependentController)
  .to(DependentController);
container
  .bind<IHealthHistoryController>(TYPES.IHealthHistoryController)
  .to(HealthHistoryController);
container
  .bind<IBehaviouralHealthController>(TYPES.IBehaviouralHealthController)
  .to(BehaviouralHealthController);
container
  .bind<ILifestyleController>(TYPES.ILifestyleController)
  .to(LifestyleController);
container
  .bind<IDoctorAuthController>(TYPES.IDoctorAuthController)
  .to(DoctorAuthController);
container.bind<IDoctorController>(TYPES.IDoctorController).to(DoctorController);
container
  .bind<ISpecializationController>(TYPES.ISpecializationController)
  .to(SpecializationController);
container
  .bind<IScheduleController>(TYPES.IScheduleController)
  .to(ScheduleController);
container
  .bind<IAppointmentController>(TYPES.IAppointmentController)
  .to(AppointmentController);
container.bind<IChatController>(TYPES.IChatController).to(ChatController);
container.bind<IWalletController>(TYPES.IWalletController).to(WalletController);
container.bind<IStripeController>(TYPES.IStripeController).to(StripeController);
container
  .bind<INotificationController>(TYPES.INotificationController)
  .to(NotificationController);
container.bind<IReviewController>(TYPES.IReviewController).to(ReviewController);
container
  .bind<IDashboardController>(TYPES.IDashboardController)
  .to(DashboardController);
container.bind<IAIChatController>(TYPES.IAIChatController).to(AIChatController);
container
  .bind<IConsultationController>(TYPES.IConsultationController)
  .to(ConsultationController);
