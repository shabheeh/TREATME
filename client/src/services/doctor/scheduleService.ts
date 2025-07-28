import { ISchedule, IScheduleInput } from "../../types/doctor/doctor.types";
import { api } from "../../utils/axiosInterceptor";

class ScheduleService {
  async getSchedule(id: string): Promise<ISchedule> {
    try {
      const response = await api.doctor.get(`/schedules/${id}`);
      const { schedule } = response.data;
      return schedule;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching schedule: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async updateSchedule(
    id: string,
    updateData: Partial<IScheduleInput>
  ): Promise<ISchedule> {
    try {
      const response = await api.doctor.patch(`/schedules/${id}`, {
        updateData,
      });
      const { schedule } = response.data;
      return schedule;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error updating schedule: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async addTimeSlot(
    doctorId: string,
    date: string,
    startTime: string,
    duration: number
  ): Promise<ISchedule> {
    try {
      const response = await api.doctor.post(`/${doctorId}/slots`, {
        date,
        startTime,
        duration,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error adding time slot: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went error`);
    }
  }

  async removeTimeSlot(
    doctorId: string,
    date: string,
    slotId: string
  ): Promise<ISchedule> {
    try {
      const response = await api.doctor.delete(`/${doctorId}/slots`, {
        params: {
          date,
          slotId,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error removing time slot: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went wrong`);
    }
  }

  async bulkUpdateSlots(
    doctorId: string,
    updates: Array<{
      date: string;
      slots: Array<{
        startTime: string;
        endTime: string;
        isBooked: boolean;
      }>;
    }>
  ): Promise<ISchedule[]> {
    try {
      const response = await api.doctor.post(`/${doctorId}/bulk-update`, {
        updates,
      });

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error removing time slot: ${error.message}`, error);
        throw new Error(error.message);
      }

      console.error(`Unknown error`, error);
      throw new Error(`Something went wrong`);
    }
  }
}

const scheduleService = new ScheduleService();
export default scheduleService;
