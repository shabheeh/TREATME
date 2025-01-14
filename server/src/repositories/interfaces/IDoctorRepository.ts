import IDoctor from "src/interfaces/IDoctor";

interface IDoctorRepository {
    createDoctor(doctor:Partial<IDoctor>): Promise<IDoctor>
}


export default IDoctorRepository