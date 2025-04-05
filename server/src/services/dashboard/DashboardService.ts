import logger from "../../configs/logger";
import IAppointmentRepository from "src/repositories/appointment/interfaces/IAppointmentRepository";
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

  async getAdminDashboardStats(): Promise<AdminDashboardData> {
    try {
      const [
        { monthlyData: incompleteMonthlyData, totalRevenue },
        { patients, total: totalPatients },
        { doctors, total: totalDoctors },
        todaysAppointments,
        weeklyAppointments,
        patientsAge,
        dependentsAge,
        specializationDoctorCount,
      ] = await Promise.all([
        this.appointmentRepo.getMonthlyRevenue(),
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

      const monthlyData = this.fillMissingMonths(incompleteMonthlyData);

      return {
        monthlyData,
        totalRevenue,
        patients,
        totalPatients,
        doctors,
        totalDoctors,
        todaysAppointments,
        weeklyAppointments,
        ageGroupCounts,
        specializationDoctorCount,
      };
    } catch (error) {
      logger.error("Error fetching dashboard data for admin", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }

  private fillMissingMonths(data: { month: string; revenue: number }[]) {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return date.toLocaleString("en-US", { month: "short" });
    });

    return months.map((month) => ({
      month,
      revenue: data.find((d) => d.month === month)?.revenue || 0,
    }));
  }

  async getDoctorDashboardStats(
    doctorId: string
  ): Promise<DoctorDashboardData> {
    try {
      const [
        { monthlyData: incompleteMonthlyData, totalRevenue },
        todaysAppointments,
        weeklyAppointments,
        averageRating,
        { patients, totalPatients },
      ] = await Promise.all([
        this.appointmentRepo.getMonthlyRevenueByDoctor(doctorId),
        this.appointmentRepo.getTodaysAppointmentByDoctor(doctorId),
        this.appointmentRepo.getWeeklyAppointmentsByDoctor(doctorId),
        this.reviewRepo.getAverageRatingByDoctorId(doctorId),
        this.appointmentRepo.getPatientsByDoctor(doctorId, 1, 5, ""),
      ]);
      const totalTodaysAppointment = todaysAppointments.length;
      const monthlyData = this.fillMissingMonths(incompleteMonthlyData);
      return {
        monthlyData,
        totalRevenue,
        todaysAppointments,
        weeklyAppointments,
        averageRating,
        patients,
        totalPatients,
        totalTodaysAppointment,
      };
    } catch (error) {
      logger.error("Error fetching dashboard data for doctor", error);
      if (error instanceof AppError) {
        throw error;
      }
      handleTryCatchError("Service", error);
    }
  }
}

export default DashboardService;
