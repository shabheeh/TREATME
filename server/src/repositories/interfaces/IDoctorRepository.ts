import IDoctor, { IDoctorsFilter, IDoctorsFilterResult} from "src/interfaces/IDoctor";

interface IDoctorRepository {
    createDoctor(doctor:Partial<IDoctor>): Promise<IDoctor>
    getDoctors(filter: IDoctorsFilter): Promise<IDoctorsFilterResult>
}


export default IDoctorRepository