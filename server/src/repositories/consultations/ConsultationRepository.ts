import {
  IConsultation,
  IConsultationPopulated,
} from "src/interfaces/IConsultation";
import BaseRepository from "../base/BaseRepository";
import { IConsultationRepository } from "./interface/IConsultationRepository";
import { Model, Types } from "mongoose";
import { AppError, handleTryCatchError } from "../../utils/errors";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";

@injectable()
class ConsultationRepository
  extends BaseRepository<IConsultation>
  implements IConsultationRepository
{
  constructor(@inject(TYPES.ConsultationModel) model: Model<IConsultation>) {
    super(model);
  }

  async getByAppointmentId(
    appointmentId: string
  ): Promise<IConsultationPopulated> {
    try {
      const result = await this.model.aggregate([
        {
          $match: {
            appointment: new Types.ObjectId(appointmentId),
          },
        },
        {
          $lookup: {
            from: "appointments",
            localField: "appointment",
            foreignField: "_id",
            as: "appointment",
          },
        },
        { $unwind: "$appointment" },
        {
          $lookup: {
            from: "patients",
            localField: "patient",
            foreignField: "_id",
            as: "patient",
          },
        },
        {
          $lookup: {
            from: "dependents",
            localField: "patient",
            foreignField: "_id",
            as: "dependentPatient",
          },
        },
        {
          $addFields: {
            patient: {
              $cond: {
                if: { $eq: ["$patientType", "Patient"] },
                then: { $arrayElemAt: ["$patient", 0] },
                else: { $arrayElemAt: ["$dependentPatient", 0] },
              },
            },
          },
        },
        {
          $project: {
            dependentPatient: 0,
          },
        },
        {
          $lookup: {
            from: "doctors",
            localField: "doctor",
            foreignField: "_id",
            as: "doctor",
          },
        },
        { $unwind: "$doctor" },
        {
          $lookup: {
            from: "specializations",
            localField: "doctor.specialization",
            foreignField: "_id",
            as: "specialization",
          },
        },
        {
          $addFields: {
            "doctor.specialization": {
              $arrayElemAt: ["$specialization.name", 0],
            },
          },
        },
        {
          $project: {
            specialization: 0,
          },
        },
      ]);

      if (!result || result.length === 0) {
        throw new AppError("Consultation not found", 404);
      }

      return result[0] as IConsultationPopulated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }
}

export default ConsultationRepository;
