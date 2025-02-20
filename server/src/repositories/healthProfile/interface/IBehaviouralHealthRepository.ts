import { IBehaviouralHealth } from '../../../interfaces/IBehaviouralHealth';

interface IBehaviouralHealthRepository {
  findBehaviouralHealth(patientId: string): Promise<IBehaviouralHealth | null>;
  updateBehaviouralHealth(
    patientId: string,
    updateData: Partial<IBehaviouralHealth>
  ): Promise<IBehaviouralHealth>;
}

export default IBehaviouralHealthRepository;
