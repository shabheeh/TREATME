import { Schema, model, Types } from "mongoose";
import {
  // IBodyMeasureMents,
  IHealthCondition,
  IHealthHistory,
  IFamilyHistory,
  IMedication,
  IAllergy,
  ISurgery,
} from "../interfaces/IHealthHistory";

const MedicationSchema = new Schema<IMedication>({
  name: { type: String, required: true },
  frequency: { type: String, required: true },
  reportedBy: { type: String, required: true },
});

const AllergySchema = new Schema<IAllergy>({
  allergicTo: { type: String, required: true },
  severity: { type: String, required: true },
  reaction: { type: String, required: true },
  reportedBy: { type: String, required: true },
});

const SurgerySchema = new Schema<ISurgery>({
  procedure: { type: String, required: true },
  year: { type: String, required: true },
  reportedBy: { type: String, required: true },
});

const healthConditionSchema = new Schema<IHealthCondition>({
  condition: { type: String, required: true },
  reportedBy: { type: String, required: true },
});

const FamilyHistorySchema = new Schema<IFamilyHistory>({
  condition: { type: String, required: true },
  relationship: { type: String, required: true },
  reportedBy: { type: String, required: true },
});

// const BodyMeasurementsSchema = new Schema<IBodyMeasureMents>({
//   height: {
//     feet: { type: Number, required: true },
//     inches: { type: Number, required: true },
//   },
//   weight: { type: Number, required: true },
//   bmi: { type: String, required: true },
// });

const HealthHistorySchema = new Schema<IHealthHistory>(
  {
    patientId: {
      type: Types.ObjectId,
      required: true,
      refPath: "patientType",
    },
    patientType: {
      type: String,
      enum: ["Patient", "Dependent"],
      required: true,
    },
    medications: { type: [MedicationSchema], required: true },
    allergies: { type: [AllergySchema], required: true },
    healthConditions: { type: [healthConditionSchema], required: true },
    surgeries: { type: [SurgerySchema], required: true },
    familyHistory: { type: [FamilyHistorySchema], required: true },
    // bodyMeasurements: { type: BodyMeasurementsSchema, required: true },
  },
  {
    timestamps: true,
  }
);

export const HealthHistoryModel = model<IHealthHistory>(
  "HealthHistory",
  HealthHistorySchema
);
