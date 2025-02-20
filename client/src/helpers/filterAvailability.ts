import { IDaySchedule, ISlot } from "../types/doctor/doctor.types";

export const filterAvailability = (
  availability: IDaySchedule[]
): IDaySchedule[] => {
  const now = new Date().getTime();

  availability.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return availability.reduce((filteredAvailability, day) => {
    const futureSlots: ISlot[] = [];

    for (const slot of day.slots) {
      const slotStartTime = new Date(slot.startTime).getTime();
      if (!slot.isBooked && slotStartTime > now) {
        futureSlots.push(slot);
      }
    }

    if (futureSlots.length > 0) {
      futureSlots.sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      filteredAvailability.push({
        ...day,
        slots: futureSlots
      });
    }

    return filteredAvailability;
  }, [] as IDaySchedule[]);
};
