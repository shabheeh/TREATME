import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
// import sessionConfig from "./configs/sessionConfig";
import patientRouter from "./routes/patient/patientRouter";
import adminRouter from "./routes/admin/adminRouter";
import doctorRouter from "./routes/doctor/doctorRouter";
import sharedRouter from "./routes/shared/sharedRouter";
import { errorHandler } from "./middlewares/errorHandler";
import chatRouter from "./routes/chat/chatRouter";
import webhookRouter from "./routes/webhook/webhookRouter";
import mediaRouter from "./routes/imageProxy/imageProxy";
import { startAppointmentNotifyJob } from "./utils/cronJobs/appointmentNotifier";
import { redisClient } from "./configs/redis";
import mongoose from "mongoose";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

interface HealthCheck {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  redis?: string;
  database?: string;
}

startAppointmentNotifyJob();

app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookRouter
);

app.get("/health", async (_req, res) => {
  try {
    const healthcheck: HealthCheck = {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
    };

    if (redisClient) {
      try {
        await redisClient.ping();
        healthcheck.redis = "Connected";
      } catch (error) {
        console.error("Redis connection failed:", error);
        healthcheck.redis = "Disconnected";
      }
    }

    if (mongoose && mongoose.connection.readyState === 1) {
      healthcheck.database = "Connected";
    } else if (mongoose) {
      healthcheck.database = "Disconnected";
    }

    res.status(200).json(healthcheck);
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(sessionConfig);
app.use(cookieParser());

app.use("/api/patient", patientRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/chats", chatRouter);
app.use("/api/media", mediaRouter);
app.use("/api", sharedRouter);

app.use(errorHandler);

export default app;
