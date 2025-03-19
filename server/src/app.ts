import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import sessionConfig from "./configs/sessionConfig";
import patientRouter from "./routes/patient/patientRouter";
import adminRouter from "./routes/admin/adminRouter";
import doctorRouter from "./routes/doctor/doctorRouter";
import sharedRouter from "./routes/shared/sharedRouter";
import { errorHandler } from "./middlewares/errorHandler";
import chatRouter from "./routes/chat/chatRouter";
import { startAppointmentNotifyJob } from "./utils/cronJobs/appointmentNotifier";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

startAppointmentNotifyJob();

app.use("/api/webhooks", express.raw({ type: "application/json" }));

//Middlewares
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);
app.use(cookieParser());

//routes
app.use("/api/patient", patientRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/chats", chatRouter);
app.use("/api", sharedRouter);

app.use(errorHandler);

export default app;
