import IAppointment, {
  IAppointmentPopulated,
} from "src/interfaces/IAppointment";

interface IAppointmentRepository {
  createAppointment(appointmentData: IAppointment): Promise<IAppointment>;
  getAppointmentById(id: string): Promise<IAppointmentPopulated>;
  updateAppointment(
    id: string,
    appointmentData: Partial<IAppointment>
  ): Promise<Partial<IAppointment>>;
  getAppointmentsByPatientId(patientId: string): Promise<IAppointment[]>;
  getAppointmentsByDoctorId(doctorId: string): Promise<IAppointment[]>;
  getAppointments(): Promise<IAppointment[]>;
}

export default IAppointmentRepository;
