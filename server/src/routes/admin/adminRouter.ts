import express from 'express';
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

const adminRepository = new AdminRespository(AdminModel)
const adminAuthService = new AdminAuthService(adminRepository)
const adminAuthController = new AdminAuthController(adminAuthService)

const doctorRepository = new DoctorRepository(DoctorModel)
const adminDoctorService = new AdminDoctorService(doctorRepository);
const adminDoctorController = new AdminDoctorController(adminDoctorService)

const userRepository = new UserRepository(UserModel);
const adminPatientsService = new AdminPatientsService(userRepository);
const adminPatientsController = new AdminPatientsController(adminPatientsService)

const router = express.Router()


router.post('/auth/signin', signinValidation, adminAuthController.signInAdmin)

router.post('/doctor', adminDoctorController.createDoctor)

router.get("/patients", adminPatientsController.getPatients)
router.get('/doctors', adminDoctorController.getDoctors)

export default router 