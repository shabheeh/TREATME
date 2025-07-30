import { model, Model, Schema } from "mongoose";
import { IConsultation } from "src/interfaces/IConsultation";
import { MedicationSchema } from "./HealthHistory";

const consultationSchema = new Schema<IConsultation>(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Appointment",
    },
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
    symptoms: [{ type: String }],
    prescriptions: { type: [MedicationSchema], required: true },
    diagnosis: { type: String },
    notes: { type: String },
    followUp: {
      required: { type: Boolean, default: false },
      timeFrame: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const ConsultationModel: Model<IConsultation> = model<IConsultation>(
  "Consultation",
  consultationSchema
);
