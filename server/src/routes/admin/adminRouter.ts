import express from 'express';
import multer from 'multer';
import { AdminModel } from '../../models/Admin';
import AdminRespository from '../../repositories/AdminRepository';
import AdminAuthService from '../../services/admin/AdminAuthService';
import AdminAuthController from '../../controllers/admin/adminAuthController';
import { signinValidation } from '../../validators/signInValidator';
import DoctorRepository from '../../repositories/DoctorRepository';
import { DoctorModel } from '../../models/Doctor';
import AdminDoctorService from '../../services/admin/adminDoctorService';
import AdminDoctorController from '../../controllers/admin/adminDoctorController';
import UserRepository from '../../repositories/UserRepository';
import { UserModel } from '../../models/User';
import AdminPatientsService from '../../services/admin/adminPatientsService';
import AdminPatientsController from '../../controllers/admin/adminPatientsController';
import { validateDoctor } from '../../validators/doctorValidator';
import { validateSpecialization } from '../../validators/specializationValidator';
import SpecializationRepository from '../../repositories/SpecializationRepository';
import { specializationModel } from '../../models/Specialization';
import SpecializationService from '../../services/specialization/sepecializationService';
import SpecializationController from '../../controllers/specialization/specializationController';
import { authenticate } from '../../middlewares/authenticate';

const adminRepository = new AdminRespository(AdminModel)
const adminAuthService = new AdminAuthService(adminRepository)
const adminAuthController = new AdminAuthController(adminAuthService)

const doctorRepository = new DoctorRepository(DoctorModel)
const adminDoctorService = new AdminDoctorService(doctorRepository);
const adminDoctorController = new AdminDoctorController(adminDoctorService)

const userRepository = new UserRepository(UserModel);
const adminPatientsService = new AdminPatientsService(userRepository);
const adminPatientsController = new AdminPatientsController(adminPatientsService)

const specializationRepository = new SpecializationRepository(specializationModel)
const specializationService = new SpecializationService(specializationRepository)
const specializationController = new SpecializationController(specializationService)

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() });


router.post('/auth/signin', signinValidation, adminAuthController.signInAdmin)

router.get('/doctors', authenticate, adminDoctorController.getDoctors)
router.post('/doctors', authenticate, upload.single('profilePicture'), 
    validateDoctor, 
    adminDoctorController.createDoctor
)

router.get("/patients", authenticate, adminPatientsController.getPatients)
router.patch('/patients/:id', authenticate, adminPatientsController.togglePatientActivityStatus)

router.post('/specializations', authenticate, upload.single('image'), 
    validateSpecialization, 
    specializationController.createSpecialization
)
router.get('/specializations', authenticate, specializationController.getSpecializations)


export default router 