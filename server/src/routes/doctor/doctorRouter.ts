import express from 'express';
import multer from "multer";
import ApplicantController from '../../controllers/applicant/applicantController'
import { ApplicantModel } from '../../models/Applicant'
import ApplicantRepository from '../../repositories/doctor/ApplicantRepository'
import ApplicantService from '../../services/applicant/applicantService'
import { authenticate, authorize } from '../../middlewares/auth'
import DoctorRepository from '../../repositories/doctor/DoctorRepository'
import { DoctorModel } from '../../models/Doctor'
import DoctorAuthService from '../../services/doctor/authService'
import DoctorAuthController from '../../controllers/doctor/authController'
import { signinValidation } from '../../validators/signInValidator'
import { validateApplicant } from '../../validators/applicantValidator';
import { convertFormData } from '../../middlewares/convertFormData';


const applicantRepository = new ApplicantRepository(ApplicantModel)
const applicantService = new ApplicantService(applicantRepository)
const applicantController = new ApplicantController(applicantService)

const doctorRepository = new DoctorRepository(DoctorModel);
const doctorAuthService = new DoctorAuthService(doctorRepository);
const doctorAuthController = new DoctorAuthController(doctorAuthService) 


const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() });

router.post('/applicants',  
    upload.fields([
        { name: "idProof", maxCount: 1 },
        { name: "resume", maxCount: 1 },
    ]),
    convertFormData,
    validateApplicant, 
    applicantController.createApplicant)

router.get('/applicants', authenticate, authorize('admin'), applicantController.getApplicants)
router.get('/applicants/:id', authenticate, authorize('admin'), applicantController.getApplicant)
router.delete('/applicants/:id', authenticate, authorize('admin'), applicantController.deleteApplicant)

router.post('/auth/signin', signinValidation, doctorAuthController.signIn)
router.post('/auth/signout', doctorAuthController.signOut)

export default router