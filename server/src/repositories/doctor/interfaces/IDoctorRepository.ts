import IDoctor, { IDoctorsFilter, IDoctorsFilterResult, ISchedule} from "src/interfaces/IDoctor";


export interface getDoctorsWithSchedulesQuery {
    specialization: string,
    gender: 'male' | 'female' | 'all';
    language: string;
    selectedDate: Date;
    page: string
}

export interface IDoctorWithSchedule extends IDoctor {
    availability: ISchedule,
}

export interface getDoctorsWithSchedulesResult {
    doctors: IDoctorWithSchedule[]
    currentPage: number;
    totalPages: number;
}




interface IDoctorRepository {
    createDoctor(doctor:Partial<IDoctor>): Promise<IDoctor>;
    findDoctorByEmail(email: string): Promise<IDoctor | null>;
    updateDoctor(id: string, updateData: Partial<IDoctor>): Promise<IDoctor>;
    getDoctors(filter: IDoctorsFilter): Promise<IDoctorsFilterResult>;
    getDoctorsWithSchedules(query: getDoctorsWithSchedulesQuery): Promise<getDoctorsWithSchedulesResult>
}


export default IDoctorRepository