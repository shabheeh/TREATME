import { IHealthHistory } from "../../../interfaces/IHealthHistory";

interface IHealthHistoryRepository {
    findHealthHistory(patientId: string): Promise<IHealthHistory | null>
    upateHealthHistory(patientId: string, updateData: Partial<IHealthHistory>): Promise<IHealthHistory>
}

export default IHealthHistoryRepository