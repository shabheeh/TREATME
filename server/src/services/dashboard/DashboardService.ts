import logger from "../../configs/logger";
import IAppointmentRepository, {
  RevenuePeriod,
} from "src/repositories/appointment/interfaces/IAppointmentRepository";
import IDoctorRepository from "src/repositories/doctor/interfaces/IDoctorRepository";
import IDependentRepository from "src/repositories/patient/interface/IDependentRepository";
import IPatientRepository from "src/repositories/patient/interface/IPatientRepository";
import { AppError, handleTryCatchError } from "../../utils/errors";
import IDashboardService, {
  AdminDashboardData,
  DoctorDashboardData,
} from "./interface/IDashboardService";
import IReviewRepository from "src/repositories/review/interface/IReviewRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class DashboardService implements IDashboardService {
  private appointmentRepo: IAppointmentRepository;
  private patientRepo: IPatientRepository;
  private dependentRepo: IDependentRepository;
  private doctorRepo: IDoctorRepository;
  private reviewRepo: IReviewRepository;

  constructor(
    @inject(TYPES.IAppointmentRepository)
    appointmentRepo: IAppointmentRepository,
    @inject(TYPES.IPatientRepository) patientRepo: IPatientRepository,
    @inject(TYPES.IDependentRepository) dependentRepo: IDependentRepository,
    @inject(TYPES.IDoctorRepository) doctorRepo: IDoctorRepository,
    @inject(TYPES.IReviewRepository) reviewRepo: IReviewRepository
  ) {
    this.appointmentRepo = appointmentRepo;
    this.patientRepo = patientRepo;
    this.dependentRepo = dependentRepo;
    this.doctorRepo = doctorRepo;
    this.reviewRepo = reviewRepo;
  }

  async getAdminDashboardStats(
    filter: "monthly" | "weekly" | "yearly" = "monthly"
  ): Promise<AdminDashboardData> {
    try {
      let revenuePromise;
      switch (filter) {
        case "monthly":
          revenuePromise = this.appointmentRepo.getMonthlyRevenue();
          break;
        case "weekly":
          revenuePromise = this.appointmentRepo.getWeeklyRevenue();
          break;
        case "yearly":
          revenuePromise = this.appointmentRepo.getYearlyRevenue();
          break;
        default:
          revenuePromise = this.appointmentRepo.getMonthlyRevenue();
      }
      const [
        { timeData: incompleteRevenueData, totalRevenue, totalAppointments },
        { patients, total: totalPatients },
        { doctors, total: totalDoctors },
        todaysAppointments,
        weeklyAppointments,
        patientsAge,
        dependentsAge,
        specializationDoctorCount,
      ] = await Promise.all([
        revenuePromise,
        this.patientRepo.getPatients({ limit: 5, page: 1, search: "" }),
        this.doctorRepo.getDoctors({ limit: 5 }),
        this.appointmentRepo.getTodaysAppointments(),
        this.appointmentRepo.getWeeklyAppointments(),
        this.patientRepo.getPatientsAges(),
        this.dependentRepo.getDependentAges(),
        this.doctorRepo.getDoctorsCountBySpecialization(),
      ]);

      const combinedAges = [...patientsAge, ...dependentsAge];

      const ageGroups = [
        { label: "0-18", min: 0, max: 18 },
        { label: "19-35", min: 19, max: 35 },
        { label: "36-50", min: 36, max: 50 },
        { label: "51-64", min: 51, max: 64 },
        { label: "65+", min: 65, max: 120 },
      ];

      const ageGroupCounts = ageGroups.map(({ label, min, max }) => ({
        ageGroup: label,
        count: combinedAges.filter(({ age }) => age >= min && age <= max)
          .length,
      }));

      let revenueData;
      switch (filter) {
        case "monthly":
          revenueData = this.fillMissingMonths(incompleteRevenueData);
          break;
        case "weekly":
          revenueData = this.fillMissingWeeks(incompleteRevenueData);
          break;
        case "yearly":
          revenueData = this.fillMissingYears(incompleteRevenueData);
          break;
        default:
          revenueData = this.fillMissingMonths(incompleteRevenueData);
      }

      return {
        revenueData,
        totalRevenue,
        patients,
        totalPatients,
        doctors,
        totalDoctors,
        todaysAppointments,
        weeklyAppointments,
        ageGroupCounts,
        specializationDoctorCount,
        totalAppointments,
        filter,
      };
    } catch (error) {
      logger.error("Error fetching dashboard data for admin", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  async getDoctorDashboardStats(
    doctorId: string,
    filter: "monthly" | "weekly" | "yearly" = "monthly"
  ): Promise<DoctorDashboardData> {
    try {
      let revenuePromise;
      switch (filter) {
        case "monthly":
          revenuePromise =
            this.appointmentRepo.getMonthlyRevenueByDoctor(doctorId);
          break;
        case "weekly":
          revenuePromise =
            this.appointmentRepo.getWeeklyRevenueByDoctor(doctorId);
          break;
        case "yearly":
          revenuePromise =
            this.appointmentRepo.getYearlyRevenueByDoctor(doctorId);
          break;
        default:
          revenuePromise =
            this.appointmentRepo.getMonthlyRevenueByDoctor(doctorId);
      }

      const [
        { timeData: incompleteRevenueData, totalRevenue, totalAppointments },
        todaysAppointments,
        weeklyAppointments,
        averageRating,
        { patients, totalPatients },
      ] = await Promise.all([
        revenuePromise,
        this.appointmentRepo.getTodaysAppointmentByDoctor(doctorId),
        this.appointmentRepo.getWeeklyAppointmentsByDoctor(doctorId),
        this.reviewRepo.getAverageRatingByDoctorId(doctorId),
        this.appointmentRepo.getPatientsByDoctor(doctorId, 1, 5, ""),
      ]);

      const totalTodaysAppointment = todaysAppointments.length;

      let revenueData;
      switch (filter) {
        case "monthly":
          revenueData = this.fillMissingMonths(incompleteRevenueData);
          break;
        case "weekly":
          revenueData = this.fillMissingWeeks(incompleteRevenueData);
          break;
        case "yearly":
          revenueData = this.fillMissingYears(incompleteRevenueData);
          break;
        default:
          revenueData = this.fillMissingMonths(incompleteRevenueData);
      }

      return {
        revenueData,
        totalRevenue,
        todaysAppointments,
        weeklyAppointments,
        averageRating,
        patients,
        totalPatients,
        totalTodaysAppointment,
        totalAppointments,
        filter,
      };
    } catch (error) {
      logger.error("Error fetching dashboard data for doctor", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  private fillMissingMonths(data: RevenuePeriod[]): RevenuePeriod[] {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return date.toLocaleString("en-US", { month: "short" });
    });

    return months.map((month) => ({
      period: month,
      revenue: data.find((d) => d.period.includes(month))?.revenue || 0,
      appointmentCount:
        data.find((d) => d.period.includes(month))?.appointmentCount || 0,
    }));
  }

  private fillMissingWeeks(data: RevenuePeriod[]): RevenuePeriod[] {
    const currentDate = new Date();
    const weeks = Array.from({ length: 12 }, (_, i) => {
      const weekDate = new Date();
      weekDate.setDate(currentDate.getDate() - (11 - i) * 7);
      const weekNumber = this.getWeekNumber(weekDate);
      return `Week ${weekNumber}, ${weekDate.getFullYear()}`;
    });

    return weeks.map((week) => ({
      period: week,
      revenue: data.find((d) => d.period === week)?.revenue || 0,
      appointmentCount:
        data.find((d) => d.period === week)?.appointmentCount || 0,
    }));
  }

  private fillMissingYears(data: RevenuePeriod[]): RevenuePeriod[] {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) =>
      String(currentYear - (4 - i))
    );

    return years.map((year) => ({
      period: year,
      revenue: data.find((d) => d.period === year)?.revenue || 0,
      appointmentCount:
        data.find((d) => d.period === year)?.appointmentCount || 0,
    }));
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
}

export default DashboardService;
