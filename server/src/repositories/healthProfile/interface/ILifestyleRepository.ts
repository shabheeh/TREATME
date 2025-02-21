import { ILifestyle } from "src/interfaces/ILifestyle";

interface ILifestyleRepository {
  findLifestyle(patientId: string): Promise<ILifestyle | null>;
  updateLifestyle(
    patientId: string,
    updateData: Partial<ILifestyle>
  ): Promise<ILifestyle>;
}

export default ILifestyleRepository;
