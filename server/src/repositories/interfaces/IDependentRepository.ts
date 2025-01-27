import IDependent from "../../interfaces/IDependent";


interface IDependentRepository {
    createDependent(dependent: Partial<IDependent>): Promise<IDependent>;
    // findDependentById(id: string): Promise<IDependent | null>;
    // updateDependent(identifier: string, patientData: Partial<IDependent>): Promise<IDependent | null> 
    getDependents(primaryUserId: string): Promise<IDependent[] | []>
}

export default IDependentRepository


