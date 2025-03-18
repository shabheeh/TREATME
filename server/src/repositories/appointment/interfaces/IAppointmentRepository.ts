import IAppointment, {
  IAppointmentPopulated,
} from "src/interfaces/IAppointment";

interface IAppointmentRepository {
  createAppointment(appointmentData: IAppointment): Promise<IAppointment>;
  getAppointmentById(id: string): Promise<IAppointmentPopulated>;
  updateAppointment(
    id: string,
    appointmentData: Partial<IAppointment>
  ): Promise<IAppointment>;
  getAppointmentsByPatientId(patientId: string): Promise<IAppointment[]>;
  getAppointmentsByDoctorId(doctorId: string): Promise<IAppointment[]>;
  getAppointments(): Promise<IAppointment[]>;
  getAppointmentByPaymentId(id: string): Promise<IAppointmentPopulated>;
  getAppointmentByPatientAndDoctorId(
    patientId: string,
    doctorId: string
  ): Promise<IAppointment | null>;
  getPatientsByDoctor(
    doctorId: string,
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<{ patients: IPatientForDoctor[]; totalPatients: number }>;
}

export default IAppointmentRepository;

export interface IPatientForDoctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  dateOfBirth: string;
  gender: "male" | "female";
  isDependent: boolean;
  primaryPatientId?: string;
  lastVisit: Date;
}
