import express from "express";
import multer from "multer";
import { signinValidation } from "../../validators/signInValidator";
import { validateDoctor } from "../../validators/doctorValidator";
import { authenticate } from "../../middlewares/auth";
import { container } from "../../configs/container";
import { TYPES } from "../../types/inversifyjs.types";
import {
  IAdminAuthController,
  IAdminDoctorController,
  IAdminPatientsController,
} from "src/interfaces/IAdmin";

const adminAuthController = container.get<IAdminAuthController>(
  TYPES.IAdminAuthController
);

const adminDoctorController = container.get<IAdminDoctorController>(
  TYPES.IAdminDoctorController
);

const adminPatientsController = container.get<IAdminPatientsController>(
  TYPES.IAdminPatientsController
);

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/auth/signin", signinValidation, adminAuthController.signInAdmin);

router.get("/doctors", authenticate, adminDoctorController.getDoctors);
router.post(
  "/doctors",
  authenticate,
  upload.single("profilePicture"),
  validateDoctor,
  adminDoctorController.createDoctor
);

router.put(
  "/doctors/:doctorId",
  authenticate,
  upload.single("profilePicture"),
  validateDoctor,
  adminDoctorController.updateDoctor
);

router.get("/patients", authenticate, adminPatientsController.getPatients);
router.patch(
  "/patients/:patientId",
  authenticate,
  adminPatientsController.togglePatientActivityStatus
);

export default router;
