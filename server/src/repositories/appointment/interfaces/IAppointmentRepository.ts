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
  getPatientsByDoctor(doctorId: string): Promise<IPatientForDoctor[]>;
}

export default IAppointmentRepository;

export interface IPatientForDoctor {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isDependent: boolean;
  primaryPatientId?: string;
  lastVisit: Date;
}
