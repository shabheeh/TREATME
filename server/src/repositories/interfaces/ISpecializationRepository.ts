
import ISpecialization from "src/interfaces/ISpecilazation";


interface ISpecializationRepository {
    createSpecialization(specialization: ISpecialization): Promise<void>
    getSpecializations(): Promise<ISpecialization[]>
}

export default ISpecializationRepository
