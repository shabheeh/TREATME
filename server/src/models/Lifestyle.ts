import { Schema, model, Types } from "mongoose";
import { ILifestyle } from "../interfaces/ILifestyle";

const lifestyleSchema = new Schema<ILifestyle>(
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
    sleepSevenPlusHrs: { type: Boolean, required: true },
    doExercise: { type: Boolean, required: true },
    doSmoke: { type: Boolean, required: true },
    doAlcohol: { type: Boolean, required: true },
    doDrugs: { type: Boolean, required: true },
    doMeditate: { type: Boolean, required: true },
    followDietPlan: { type: Boolean, required: true },
    highStress: { type: Boolean, required: true },
    vaccinatedCovid19: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export const LifestyleModel = model<ILifestyle>("Lifestyle", lifestyleSchema);
