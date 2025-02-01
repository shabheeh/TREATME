import express from 'express';
import multer from 'multer';
import SpecializationRepository from '../../repositories/specialization/SpecializationRepository';
import { SpecializationModel } from '../../models/Specialization';
import SpecializationService from '../../services/specialization/sepecializationService';
import SpecializationController from '../../controllers/specialization/specializationController';
import { validateSpecialization } from '../../validators/specializationValidator';
import { authenticate, authorize } from '../../middlewares/auth';
import { isUserActive } from '../../middlewares/checkUserStatus';
import PatientRepository from '../../repositories/patient/PatientRepository';
import { PatientModel } from '../../models/Patient';
import PatientAuthService from '../../services/patient/authService';
import OtpService from '../../services/OtpService';
import CacheService from '../../services/CacheService';
import TokenController from '../../controllers/shared/tokenController';
import { checkUserStatus } from '../../controllers/shared/userStatusController';
import DoctorRepository from '../../repositories/doctor/DoctorRepository';
import { DoctorModel } from '../../models/Doctor';
import DoctorAuthService from '../../services/doctor/authService';
import HealthHistoryRepository from "../../repositories/healthProfile/HealthHistoryRepository";
import { HealthHistory } from "../../models/HealthHistory";
import HealthHistoryService from "../../services/healthProfilel/HealthHistoryService";
import HealthHistoryController from "../../controllers/healthProfile/healthHistoryController";

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() });

const tokenController = new TokenController();

// speicailization di-(dipendency injection)
const specializationRepository = new SpecializationRepository(SpecializationModel)
const specializationService = new SpecializationService(specializationRepository)
const specializationController = new SpecializationController(specializationService)

// patient auth di
const patientRepository = new PatientRepository(PatientModel);
const cacheService = new CacheService();
const otpService = new OtpService(cacheService)
const patientAuthService = new PatientAuthService(patientRepository, otpService, cacheService)

// doctor auth di
const doctorRepository = new DoctorRepository(DoctorModel)
const doctorAuthService = new DoctorAuthService(doctorRepository)

// health history di
const healthHistoryRepository = new HealthHistoryRepository(HealthHistory);
const healthHistoryService = new HealthHistoryService(healthHistoryRepository);
const healthHistoryController = new HealthHistoryController(healthHistoryService);


router.post('/auth/refresh-token',tokenController.handleRefreshToken)
router.get('/auth/status', authenticate, checkUserStatus(patientAuthService, doctorAuthService))

router.post('/specializations', authenticate, authorize('admin'), upload.single('image'), 
    validateSpecialization, 
    specializationController.createSpecialization
)
router.get('/specializations', authenticate, isUserActive(patientAuthService, doctorAuthService), specializationController.getSpecializations)
router.get('/specializations/public', specializationController.getSpecializations)
router.get('/specializations/:id', authenticate, authorize('admin'), specializationController.getSpecializationById)
router.put('/specializations/:id', authenticate, authorize('admin'), upload.single('image'), specializationController.updateSpecialization)

router.get('/health-hitory/:id', 
    authenticate,
    isUserActive(patientAuthService, doctorAuthService),
    authorize('patient'),
    healthHistoryController.getHealthHistory
)

router.put('/health-history/:id',
    authenticate,
    isUserActive(patientAuthService, doctorAuthService),
    authorize('patient'),
    healthHistoryController.updateHealthHistory
)



export default router 