import {
  IHealthHistory,
  IMedication,
} from "../../../interfaces/IHealthHistory";

interface IHealthHistoryRepository {
  findHealthHistory(patientId: string): Promise<IHealthHistory | null>;
  upateHealthHistory(
    patientId: string,
    updateData: Partial<IHealthHistory>
  ): Promise<IHealthHistory>;
  addOrUpdateMedication(
    patientId: string,
    medication: IMedication
  ): Promise<IHealthHistory | null>;
}

export default IHealthHistoryRepository;
