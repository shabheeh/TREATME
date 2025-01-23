import express from 'express';
import multer from 'multer';
import SpecializationRepository from '../../repositories/SpecializationRepository';
import { specializationModel } from '../../models/Specialization';
import SpecializationService from '../../services/specialization/sepecializationService';
import SpecializationController from '../../controllers/specialization/specializationController';
import { validateSpecialization } from '../../validators/specializationValidator';
import { authenticate, authorize } from '../../middlewares/auth';
import { checkUserStatus } from '../../middlewares/checkUserStatus';
import PatientRepository from '../../repositories/PatientRepository';
import { PatientModel } from '../../models/Patient';
import PatientAuthService from '../../services/patient/authService';
import OtpService from '../../services/OtpService';
import CacheService from '../../services/CacheService';
import TokenController from '../../controllers/shared/tokenController';

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() });


const specializationRepository = new SpecializationRepository(specializationModel)
const specializationService = new SpecializationService(specializationRepository)
const specializationController = new SpecializationController(specializationService)

const patientRepository = new PatientRepository(PatientModel);
const cacheService = new CacheService();
const otpService = new OtpService(cacheService)
const patientAuthService = new PatientAuthService(patientRepository, otpService, cacheService)

const tokenController = new TokenController();


router.post('/specializations', authenticate, authorize('admin'), upload.single('image'), 
    validateSpecialization, 
    specializationController.createSpecialization
)

router.get('/specializations', authenticate, checkUserStatus(patientAuthService), specializationController.getSpecializations)

router.get('/specializations/:id', authenticate, authorize('admin'), specializationController.getSpecializationById)

router.put('/specializations/:id', authenticate, authorize('admin'), upload.single('image'), specializationController.updateSpecialization)

router.post('/auth/refresh-token',tokenController.handleRefreshToken)

export default router 