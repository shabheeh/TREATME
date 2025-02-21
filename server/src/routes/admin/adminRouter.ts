import express from "express";
import multer from "multer";
import { AdminModel } from "../../models/Admin";
import AdminRespository from "../../repositories/admin/AdminRepository";
import AdminAuthService from "../../services/admin/AdminAuthService";
import AdminAuthController from "../../controllers/admin/adminAuthController";
import { signinValidation } from "../../validators/signInValidator";
import DoctorRepository from "../../repositories/doctor/DoctorRepository";
import { DoctorModel } from "../../models/Doctor";
import AdminDoctorService from "../../services/admin/adminDoctorService";
import AdminDoctorController from "../../controllers/admin/adminDoctorController";
import UserRepository from "../../repositories/patient/PatientRepository";
import { PatientModel } from "../../models/Patient";
import AdminPatientsService from "../../services/admin/adminPatientsService";
import AdminPatientsController from "../../controllers/admin/adminPatientsController";
// import { validateDoctor } from '../../validators/doctorValidator';

import { authenticate } from "../../middlewares/auth";

const adminRepository = new AdminRespository(AdminModel);
const adminAuthService = new AdminAuthService(adminRepository);
const adminAuthController = new AdminAuthController(adminAuthService);

const doctorRepository = new DoctorRepository(DoctorModel);
const adminDoctorService = new AdminDoctorService(doctorRepository);
const adminDoctorController = new AdminDoctorController(adminDoctorService);

const userRepository = new UserRepository(PatientModel);
const adminPatientsService = new AdminPatientsService(userRepository);
const adminPatientsController = new AdminPatientsController(
  adminPatientsService
);

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/auth/signin", signinValidation, adminAuthController.signInAdmin);

router.get("/doctors", authenticate, adminDoctorController.getDoctors);
router.post(
  "/doctors",
  authenticate,
  upload.single("profilePicture"),
  // validateDoctor,
  adminDoctorController.createDoctor
);

router.get("/patients", authenticate, adminPatientsController.getPatients);
router.patch(
  "/patients/:patientId",
  authenticate,
  adminPatientsController.togglePatientActivityStatus
);

export default router;
