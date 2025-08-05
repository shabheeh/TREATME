import cron from "node-cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { INotification } from "../../interfaces/INotification";
import { Types } from "mongoose";
import logger from "../../configs/logger";
import { container } from "../../configs/container";
import { INotificationService } from "src/services/notification/interface/INotificationService";
import { TYPES } from "../../types/inversifyjs.types";
import IAppointmentRepository from "src/repositories/appointment/interfaces/IAppointmentRepository";
import { IAppointmentPopulated } from "src/interfaces/IAppointment";
import { ICacheService } from "src/interfaces/IShared";

dayjs.extend(utc);

const notificationService = container.get<INotificationService>(
  TYPES.INotificationService
);

const appointmentRepo = container.get<IAppointmentRepository>(
  TYPES.IAppointmentRepository
);

const cacheService = container.get<ICacheService>(TYPES.ICacheService);

const NOTIFICATION_KEY_PREFIX = "appointment_notification";
const NOTIFICATION_TTL = 2 * 60 * 60;

export const startAppointmentNotifyJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = dayjs.utc();

      // const thirtyMinutesFromNow = now.add(30, "minute");
      // const fiveMinutesFromNow = now.add(5, "minute");
      const thirtyOneMinutesFromNow = now.add(31, "minute");
      const fourMinutesFromNow = now.add(4, "minute");

      const upcomingAppointments =
        await appointmentRepo.getAppointmentsForNotification(
          fourMinutesFromNow.toDate(),
          thirtyOneMinutesFromNow.toDate()
        );

      for (const appointment of upcomingAppointments) {
        const appointmentTime = dayjs.utc(appointment.date);
        const timeLeftMinutes = appointmentTime.diff(now, "minute");

        const notificationKey5Min = `${NOTIFICATION_KEY_PREFIX}:${appointment._id}:5min`;
        const notificationKey30Min = `${NOTIFICATION_KEY_PREFIX}:${appointment._id}:30min`;

        if (timeLeftMinutes >= 4 && timeLeftMinutes <= 6) {
          const alreadySent = await cacheService.exists(notificationKey5Min);

          if (!alreadySent) {
            await sendNotifications(appointment, 5, true);

            await cacheService.store(
              notificationKey5Min,
              "sent",
              NOTIFICATION_TTL
            );

            logger.info(
              `5-minute notifications sent for appointment ${appointment._id}`
            );
          } else {
            logger.debug(
              `5-minute notification already sent for appointment ${appointment._id}`
            );
          }
        } else if (timeLeftMinutes >= 29 && timeLeftMinutes <= 31) {
          const alreadySent = await cacheService.exists(notificationKey30Min);

          if (!alreadySent) {
            await sendNotifications(appointment, 30, false);

            await cacheService.store(
              notificationKey30Min,
              "sent",
              NOTIFICATION_TTL
            );

            logger.info(
              `30-minute notifications sent for appointment ${appointment._id}`
            );
          } else {
            logger.debug(
              `30-minute notification already sent for appointment ${appointment._id}`
            );
          }
        }
      }
    } catch (error) {
      logger.error(
        error instanceof Error
          ? `Error in appointment notification cron job: ${error.message}`
          : "Unknown error in appointment notification cron job"
      );
    }
  });
};

async function sendNotifications(
  appointment: IAppointmentPopulated,
  minutes: number,
  includeVideoLink: boolean = false
): Promise<void> {
  try {
    const linkText = includeVideoLink
      ? " You can join using the link below."
      : "";
    const videoLink = includeVideoLink
      ? `/video-consultation?room=${appointment._id}`
      : undefined;

    const notificationForPatient: Partial<INotification> = {
      user: appointment.patient._id as Types.ObjectId,
      userType: "Patient",
      title: "Appointment Reminder",
      message: `Your appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} starts in ${minutes} minutes.${linkText}`,
      type: "appointments",
      priority: "high",
      ...(videoLink && { link: videoLink }),
    };

    const notificationForDoctor: Partial<INotification> = {
      user: appointment.doctor._id as Types.ObjectId,
      userType: "Doctor",
      title: "Appointment Reminder",
      message: `Your appointment with patient ${appointment.patient.firstName} ${appointment.patient.lastName} starts in ${minutes} minutes.${linkText}`,
      type: "appointments",
      priority: "high",
      ...(videoLink && { link: videoLink }),
    };

    await Promise.all([
      notificationService.createNotification(notificationForPatient),
      notificationService.createNotification(notificationForDoctor),
    ]);

    logger.info(
      `${minutes}-minute notifications created for appointment ${appointment._id}`
    );
  } catch (error) {
    logger.error(
      `Failed to send ${minutes}-minute notifications for appointment ${appointment._id}:`,
      error
    );
    throw error;
  }
}

export const clearNotificationCache = async (
  appointmentId: string
): Promise<void> => {
  try {
    const keys = [
      `${NOTIFICATION_KEY_PREFIX}:${appointmentId}:5min`,
      `${NOTIFICATION_KEY_PREFIX}:${appointmentId}:30min`,
    ];

    await Promise.all(keys.map((key) => cacheService.delete(key)));
    logger.info(`Cleared notification cache for appointment ${appointmentId}`);
  } catch (error) {
    logger.error(
      `Failed to clear notification cache for appointment ${appointmentId}:`,
      error
    );
    throw error;
  }
};

export const getNotificationStatus = async (appointmentId: string) => {
  try {
    const keys = [
      `${NOTIFICATION_KEY_PREFIX}:${appointmentId}:5min`,
      `${NOTIFICATION_KEY_PREFIX}:${appointmentId}:30min`,
    ];

    const [fiveMinSent, thirtyMinSent] = await Promise.all(
      keys.map((key) => cacheService.exists(key))
    );

    return {
      appointmentId,
      fiveMinuteNotificationSent: fiveMinSent,
      thirtyMinuteNotificationSent: thirtyMinSent,
    };
  } catch (error) {
    logger.error(
      `Failed to get notification status for appointment ${appointmentId}:`,
      error
    );
    throw error;
  }
};
