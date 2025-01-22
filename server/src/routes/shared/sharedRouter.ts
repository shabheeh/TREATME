import express from 'express';
import multer from 'multer';
import SpecializationRepository from '../../repositories/SpecializationRepository';
import { specializationModel } from '../../models/Specialization';
import SpecializationService from '../../services/specialization/sepecializationService';
import SpecializationController from '../../controllers/specialization/specializationController';
import { validateSpecialization } from '../../validators/specializationValidator';
import { authenticate, authorize } from '../../middlewares/auth';


const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() });


const specializationRepository = new SpecializationRepository(specializationModel)
const specializationService = new SpecializationService(specializationRepository)
const specializationController = new SpecializationController(specializationService)


router.post('/specializations', authenticate, authorize('admin'), upload.single('image'), 
    validateSpecialization, 
    specializationController.createSpecialization
)

router.get('/specializations', authenticate, specializationController.getSpecializations)

router.get('/specializations/:id', authenticate, authorize('admin'), specializationController.getSpecializationById)

router.put('/specializations/:id', authenticate, authorize('admin'), upload.single('image'), specializationController.updateSpecialization)



export default router 