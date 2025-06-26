import { Document, Model } from "mongoose";
import { IBaseRepository } from "./interfaces/IBaseRepository";
import { handleTryCatchError } from "../../utils/errors";

class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const doc = new this.model(data);
      return await doc.save();
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async findAll(): Promise<T[]> {
    try {
      return await this.model.find().exec();
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }
}

export default BaseRepository;
