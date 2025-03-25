import logger from "src/configs/logger";
import IAppointmentRepository from "src/repositories/appointment/interfaces/IAppointmentRepository";
import IDoctorRepository from "src/repositories/doctor/interfaces/IDoctorRepository";
import IDependentRepository from "src/repositories/patient/interface/IDependentRepository";
import IPatientRepository from "src/repositories/patient/interface/IPatientRepository";
import { AppError } from "src/utils/errors";
import IDashboardService, {
  DashboardData,
} from "./interface/IDashboardService";

class DashboardService implements IDashboardService {
  private appointmentRepo: IAppointmentRepository;
  private patientRepo: IPatientRepository;
  private dependentRepo: IDependentRepository;
  private doctorRepo: IDoctorRepository;

  constructor(
    appointmentRepo: IAppointmentRepository,
    patientRepo: IPatientRepository,
    dependentRepo: IDependentRepository,
    doctorRepo: IDoctorRepository
  ) {
    this.appointmentRepo = appointmentRepo;
    this.patientRepo = patientRepo;
    this.dependentRepo = dependentRepo;
    this.doctorRepo = doctorRepo;
  }

  async getDashboardStats(): Promise<DashboardData> {
    try {
      const { monthlyData, totalRevenue } =
        await this.appointmentRepo.getMonthlyRevenue();
      const { patients, total: totalPatients } =
        await this.patientRepo.getPatients({
          limit: 5,
          page: 1,
          search: "",
        });
      const { doctors, total: totalDoctors } = await this.doctorRepo.getDoctors(
        { limit: 5 }
      );
      const todaysAppointments =
        await this.appointmentRepo.getTodaysAppointments();
      const weeklyAppointments =
        await this.appointmentRepo.getWeeklyAppointments();

      const patientsAge = await this.patientRepo.getPatientsAges();
      const dependentsAge = await this.dependentRepo.getDependentAges();

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
      const specializationDoctorCount =
        await this.doctorRepo.getDoctorsCountBySpecialization();

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
      logger.error("Error creating dependent", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  // private fillMissingMonths(data: { month: string; revenue: number }[]) {
  //   const months = Array.from({ length: 12 }, (_, i) => {
  //     const date = new Date();
  //     date.setMonth(date.getMonth() - (11 - i));
  //     return date.toISOString().slice(0, 7);
  //   });

  //   return months.map((month) => ({
  //     month,
  //     revenue: data.find((d) => d.month === month)?.revenue || 0,
  //   }));
  // }
}

export default DashboardService;
