import cron from "node-cron";
import dayjs from "dayjs";
import { AppointmentModel } from "../../models/Appointment";
import { NotificationModel } from "../../models/Notification";
import AppointmentRepository from "../../repositories/appointment/AppointmentRepository";
import NotificationRepository from "../../repositories/notification/NotificationRepository";
import NotificationService from "../../services/notification/NotificationService";
import { INotification } from "../../interfaces/INotification";
import { Types } from "mongoose";
import logger from "../../configs/logger";

const appointmentRepo = new AppointmentRepository(AppointmentModel);
const notificationRepo = new NotificationRepository(NotificationModel);
const notificationService = new NotificationService(notificationRepo);

export const startAppointmentNotifyJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = dayjs();

      const upcomingAppointments = await appointmentRepo.getAppointments();

      for (const appointment of upcomingAppointments) {
        const timeLeft = dayjs(appointment.date).diff(now, "minute");

        if (timeLeft === 3) {
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
