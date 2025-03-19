import { Model, model, Schema } from "mongoose";
import IAppointment from "../interfaces/IAppointment";

const appointmentSchema = new Schema<IAppointment>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "patientType",
    },
    patientType: {
      type: String,
      enum: ["Patient", "Dependent"],
      required: true,
    },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
    specialization: {
      type: Schema.Types.ObjectId,
      ref: "Specialization",
      required: true,
    },
    reason: { type: String, required: true },
    date: { type: Date },
    duration: { type: Number },
    status: { type: String, required: true },
    fee: { type: Number, required: true },
    dayId: { type: String },
    slotId: { type: String },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"] },
    paymentIntentId: { type: String },
  },
  {
    timestamps: true,
  }
);

export const AppointmentModel: Model<IAppointment> = model<IAppointment>(
  "Appointment",
  appointmentSchema
);
