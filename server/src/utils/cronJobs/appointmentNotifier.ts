import cron from "node-cron";
import dayjs from "dayjs";
import { INotification } from "../../interfaces/INotification";
import { Types } from "mongoose";
import logger from "../../configs/logger";
import { container } from "../../configs/container";
import { INotificationService } from "src/services/notification/interface/INotificationService";
import { TYPES } from "../../types/inversifyjs.types";
import IAppointmentRepository from "src/repositories/appointment/interfaces/IAppointmentRepository";

const notificationService = container.get<INotificationService>(
  TYPES.INotificationService
);

const appointmentRepo = container.get<IAppointmentRepository>(
  TYPES.IAppointmentRepository
);

export const startAppointmentNotifyJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const upcomingAppointments = await appointmentRepo.getAppointments();

      for (const appointment of upcomingAppointments) {
        const timeLeft = dayjs
          .utc(appointment.date)
          .diff(dayjs.utc(), "minute");

        if (timeLeft === 5) {
          const notificationForPatient: Partial<INotification> = {
            user: appointment.patient._id as Types.ObjectId,
            userType: "Patient",
            title: "Appointment Reminder",
            message: `Your appointment with dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}  starts in 5 minutes. You can join using the link below.`,
            type: "appointments",
            priority: "high",
            link: `/video-consultation?room=${appointment._id}`,
          };

          const notificationForDoctor: Partial<INotification> = {
            user: appointment.doctor._id as Types.ObjectId,
            userType: "Doctor",
            title: "Appointment Reminder",
            message: `Your appointment with patient ${appointment.patient.firstName} ${appointment.patient.lastName} starts in 5 minuts. Join the call using the link below`,
            type: "appointments",
            priority: "high",
            link: `/video-consultation?room=${appointment._id}`,
          };

          await Promise.all([
            notificationService.createNotification(notificationForPatient),
            notificationService.createNotification(notificationForDoctor),
          ]);
        } else if (timeLeft === 30) {
          const notificationForPatient: Partial<INotification> = {
            user: appointment.patient._id as Types.ObjectId,
            userType: "Patient",
            title: "Appointment Reminder",
            message: `Your appointment with dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}  starts in 30 minutes!`,
            type: "appointments",
            priority: "high",
          };

          const notificationForDoctor: Partial<INotification> = {
            user: appointment.doctor._id as Types.ObjectId,
            userType: "Doctor",
            title: "Appointment Reminder",
            message: `Your appointment with patient ${appointment.patient.firstName} ${appointment.patient.lastName} starts in 30 minuts!`,
            type: "appointments",
            priority: "high",
          };

          await Promise.all([
            notificationService.createNotification(notificationForPatient),
            notificationService.createNotification(notificationForDoctor),
          ]);
        }
      }
    } catch (error) {
      logger.error(
        error instanceof Error
          ? `error nofiying appointment cron-job: ${error.message}`
          : "Error notify appointment cron job"
      );
    }
  });
};
