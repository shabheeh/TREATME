import express from 'express'
import ApplicantController from '../../controllers/applicant/applicantController'
import { ApplicantModel } from '../../models/Applicant'
import ApplicantRepository from '../../repositories/ApplicantRepository'
import ApplicantService from '../../services/applicant/applicantService'
import { authenticate } from '../../middlewares/auth'


const applicantRepository = new ApplicantRepository(ApplicantModel)
const applicantService = new ApplicantService(applicantRepository)
const applicantController = new ApplicantController(applicantService)


const router = express.Router()


router.post('/applicants', authenticate, applicantController.createApplicant)
router.get('/applicants', authenticate, applicantController.getApplicants)


export default router