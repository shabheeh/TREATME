import IDoctor, { IDoctorsFilter, IDoctorsFilterResult} from "src/interfaces/IDoctor";

interface IDoctorRepository {
    createDoctor(doctor:Partial<IDoctor>): Promise<IDoctor>;
    findDoctorByEmail(email: string): Promise<IDoctor | null>;
    updateDoctor(id: string, updateData: Partial<IDoctor>): Promise<IDoctor>;
    getDoctors(filter: IDoctorsFilter): Promise<IDoctorsFilterResult>;
}


export default IDoctorRepository