import express from 'express'
import ApplicantController from '../../controllers/applicant/applicantController'
import { ApplicantModel } from '../../models/Applicant'
import ApplicantRepository from '../../repositories/ApplicantRepository'
import ApplicantService from '../../services/applicant/applicantService'
import { authenticate } from '../../middlewares/auth'
import DoctorRepository from '../../repositories/DoctorRepository'
import { DoctorModel } from '../../models/Doctor'
import DoctorAuthService from '../../services/doctor/authService'
import DoctorAuthController from '../../controllers/doctor/authController'
import { signinValidation } from '../../validators/signInValidator'


const applicantRepository = new ApplicantRepository(ApplicantModel)
const applicantService = new ApplicantService(applicantRepository)
const applicantController = new ApplicantController(applicantService)

const doctorRepository = new DoctorRepository(DoctorModel);
const doctorAuthService = new DoctorAuthService(doctorRepository);
const doctorAuthController = new DoctorAuthController(doctorAuthService) 


const router = express.Router()


router.post('/applicants', authenticate, applicantController.createApplicant)
router.get('/applicants', authenticate, applicantController.getApplicants)

router.post('/auth/signin', signinValidation, doctorAuthController.signIn)
router.post('/auth/signout', doctorAuthController.signOut)

export default router