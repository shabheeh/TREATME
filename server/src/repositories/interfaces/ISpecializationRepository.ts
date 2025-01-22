
import ISpecialization from "src/interfaces/ISpecilazation";


interface ISpecializationRepository {
    createSpecialization(specialization: ISpecialization): Promise<void>
    getSpecializations(): Promise<ISpecialization[]>
    getSpecializationById(id: string): Promise<ISpecialization | null>
    updateSpecialization(id: string, updateData: Partial<ISpecialization>): Promise<ISpecialization | null>
}

export default ISpecializationRepository
