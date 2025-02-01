import { IHealthHistory } from "../../../interfaces/IHealthHistory";

interface IHealthHistoryRepository {
    findHealthHistory(patientId: string): Promise<IHealthHistory>
    upateHealthHistory(patientId: string, updateData: Partial<IHealthHistory>): Promise<IHealthHistory>
}

export default IHealthHistoryRepository