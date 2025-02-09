import { Model } from "mongoose";
import IDoctorRepository, { getDoctorsWithSchedulesQuery, getDoctorsWithSchedulesResult } from "./interfaces/IDoctorRepository";
import IDoctor, { IDoctorsFilter, IDoctorsFilterResult } from "src/interfaces/IDoctor";
import { AppError } from "../../utils/errors";


class DoctorRepository implements IDoctorRepository {
    
    private readonly model: Model<IDoctor>

    constructor(model: Model<IDoctor>) {
        this.model = model
    }

    async createDoctor(doctor: Partial<IDoctor>): Promise<IDoctor> {
        try {
            const newDoctor = await this.model.create(doctor)
            return newDoctor.toObject()
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async findDoctorByEmail(email: string): Promise<IDoctor | null> {
        try {
            const doctor = await this.model.findOne({ email })
                .populate('specialization')
                .lean();
            return doctor;
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async updateDoctor(id: string, updateData: Partial<IDoctor>): Promise<IDoctor> {
        try {
            const updatedDoctor = await this.model.findOneAndUpdate(
                { _id: id },
                { $set: updateData },
                { 
                    new: true,
                    lean: true
                }
            ).select('-password');

            if (!updatedDoctor) {
                throw new AppError('Something went wrong')
            }

            return updatedDoctor;
            
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async getDoctors(filter: IDoctorsFilter): Promise<IDoctorsFilterResult> {
        try {
            const { page, limit, search } = filter;
            const skip = (page - 1) * limit;

            const query: any = {}

            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }

            ]

            const doctors = await this.model.find(query)
                .skip(skip)
                .limit(limit)
            const total = await this.model.countDocuments(query)

            return {
                doctors,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    async getDoctorsWithSchedules(query: getDoctorsWithSchedulesQuery): Promise<getDoctorsWithSchedulesResult> {
        try {
            const { specialization, gender, language, page = '1', selectedDate } = query;
    
            const skip = (parseInt(page) - 1) * 10;
            const limit = 10;
    
            const selectedDateISO = selectedDate ? new Date(selectedDate) : new Date();
            const nextDayISO = selectedDate ? new Date(selectedDateISO.getTime() + 86400000) : null;
    
            const totalDoctorsCount = await this.model.countDocuments({
              ...(specialization && { specialization }),
              ...(gender && { gender: gender.toString() }),
              ...(language && { languages: language.toString() }),
            });
    
            const doctors = await this.model.aggregate([
                {
                  $match: {
                    ...(specialization && { specialization }), 
                    ...(gender && { gender: gender.toString() }), 
                    ...(language && { languages: language.toString() }), 
                  }
                },
                {
                  $lookup: {
                    from: "schedules", 
                    localField: "_id",
                    foreignField: "doctorId",
                    as: "availability",
                  }
                },
                {
                  $addFields: {
                    availability: {
                      $filter: {
                        input: "$availability",
                        as: "av",
                        cond: {
                          $and: [
                            { $gte: ["$$av.date", selectedDateISO] },
                            { $lt: ["$$av.date", nextDayISO] }
                          ]
                        }
                      }
                    }
                  }
                },
                {
                  $match: { "availability.0": { $exists: true } }
                },
                {
                  $project: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                    specialization: 1,
                    gender: 1,
                    languages: 1,
                    availability: 1,
                  }
                },
                { $skip: skip },
                { $limit: limit }
              ]);
    
              return {
                doctors,                 
                currentPage: parseInt(page),  
                totalPages: Math.ceil(totalDoctorsCount / limit) 
              };
    
        } catch (error) {
            throw new AppError(
                `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }
    
}

export default DoctorRepository;