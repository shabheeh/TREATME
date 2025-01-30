
import express from "express";
import multer from "multer";
import { PatientModel } from "../../models/Patient";
import PatientRepository from "../../repositories/patient/PatientRepository";
import PatientAuthService from "../../services/patient/authService";
import OtpService from "../../services/OtpService";
import CacheService from "../../services/CacheService";
import PatientAuthController from "../../controllers/patient/PatientAuthController";
import { validateUser } from "../../validators/userValidator";
import { signinValidation } from "../../validators/signInValidator";
import { errors } from 'celebrate';
import { authenticate, authorize } from "../../middlewares/auth";
import PatientAcccountService from "../../services/patient/accountService";
import PatientAcccountController from "../../controllers/patient/patientAccountController";
import { isUserActive } from "../../middlewares/checkUserStatus";
import DependentRepository from "../../repositories/patient/DependentRepository";
import { DependentModel } from "../../models/Dependent";
import DependentService from "../../services/dependent/dependentService";
import DependentController from "../../controllers/dependent/dependentController";


const router = express.Router(); 
 
const upload = multer({ storage: multer.memoryStorage() });

const patientRepository = new PatientRepository(PatientModel); 
const cacheService = new CacheService()
const otpService = new OtpService(cacheService)
const patientAuthService = new PatientAuthService(patientRepository, otpService, cacheService);
const patientAuthController = new PatientAuthController(patientAuthService, otpService);

const patientAccountService = new PatientAcccountService(patientRepository);
const patientAccountController = new PatientAcccountController(patientAccountService)

const dependentRepository = new DependentRepository(DependentModel)
const dependentService = new DependentService(dependentRepository)
const dependentController = new DependentController(dependentService)

router.post('/auth/send-otp', signinValidation, patientAuthController.sendOtp)
router.post('/auth/verify-otp', patientAuthController.verifyOtp)

router.post('/auth/signup', 
    validateUser,
    patientAuthController.signup
);

router.post('/auth/signin', signinValidation, patientAuthController.signin)
router.post('/auth/forgot-password/verify-email', patientAuthController.sendOtpForgotPassowrd)
router.post("/auth/forgot-password/verify-otp" , patientAuthController.verifyOtpForgotPassword)
router.patch("/auth/reset-password", patientAuthController.resetPassword)
router.post("/auth/google", patientAuthController.googleSignIn)
router.post("/auth/complete-profile", authenticate, patientAuthController.completeProfile)
router.post('/auth/resend-otp', patientAuthController.resendOtp)
router.post('/auth/forgot-password/resend-otp', patientAuthController.resendOtpForgotPassword)
router.post('/auth/signout', patientAuthController.signOut)


router.put('/profile', 
    authenticate, 
    isUserActive(patientAuthService), 
    authorize('patient'),  
    upload.single('profilePicture'),
    patientAccountController.updateProfile
) 

router.post('/dependents', 
    authenticate, 
    isUserActive(patientAuthService), 
    authorize('patient'), 
    upload.single('profilePicture'),
    dependentController.createDependent
)

router.get('/dependents/:id',
    authenticate,
    isUserActive(patientAuthService),
    authorize('patient'),
    dependentController.getDependents
)

router.put('/dependents/:id',
    authenticate,
    isUserActive(patientAuthService),
    authorize('patient'),
    upload.single('profilePicture'),
    dependentController.updateDependent
)

router.delete('/dependents/:id',
    authenticate,
    isUserActive(patientAuthService),
    authorize('patient'),
    dependentController.deleteDependent
)



router.use(errors());

export default router; 