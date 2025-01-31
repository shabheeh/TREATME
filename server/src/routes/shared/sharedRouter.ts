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

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() });


const specializationRepository = new SpecializationRepository(SpecializationModel)
const specializationService = new SpecializationService(specializationRepository)
const specializationController = new SpecializationController(specializationService)

const patientRepository = new PatientRepository(PatientModel);
const cacheService = new CacheService();
const otpService = new OtpService(cacheService)
const patientAuthService = new PatientAuthService(patientRepository, otpService, cacheService)

const doctorRepository = new DoctorRepository(DoctorModel)
const doctorAuthService = new DoctorAuthService(doctorRepository)

const tokenController = new TokenController();


router.post('/specializations', authenticate, authorize('admin'), upload.single('image'), 
    validateSpecialization, 
    specializationController.createSpecialization
)

router.get('/specializations', authenticate, isUserActive(patientAuthService), specializationController.getSpecializations)

router.get('/specializations/public', specializationController.getSpecializations)


router.get('/specializations/:id', authenticate, authorize('admin'), specializationController.getSpecializationById)

router.put('/specializations/:id', authenticate, authorize('admin'), upload.single('image'), specializationController.updateSpecialization)

router.post('/auth/refresh-token',tokenController.handleRefreshToken)

router.get('/auth/status', authenticate, checkUserStatus(patientAuthService, doctorAuthService))

export default router 