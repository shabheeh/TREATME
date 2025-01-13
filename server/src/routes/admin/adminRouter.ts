import express from 'express';
import { AdminModel } from '../../models/Admin';
import AdminRespository from '../../repositories/AdminRepository';
import AdminAuthService from '../../services/admin/AdminAuthService';
import AdminAuthController from '../../controllers/admin/adminAuthController';
import { signinValidation } from '../../validators/signInValidator';

const adminRepository = new AdminRespository(AdminModel)
const adminAuthService = new AdminAuthService(adminRepository)
const adminAuthController = new AdminAuthController(adminAuthService)


const router = express.Router()

router.post('/auth/signup', signinValidation, adminAuthController.signUpAdmin)

router.post('/auth/signin', signinValidation, adminAuthController.signInAdmin)

export default router 