import { Schema, model } from 'mongoose';
import { IDaySchedule, ISchedule, ISlot } from '../interfaces/IDoctor';

const slotSchema = new Schema<ISlot>({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isBooked: { type: Boolean, default: false },
});

const availabilitySchema = new Schema<IDaySchedule>({
  date: { type: Date, required: true, index: { expires: '30d' } },
  slots: [slotSchema],
});

const scheduleSchema = new Schema<ISchedule>({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
    unique: true,
  },
  availability: [availabilitySchema],
});

export const ScheduleModel = model<ISchedule>('Schedule', scheduleSchema);
