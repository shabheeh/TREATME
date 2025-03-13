import { ITransaction, IWallet, WalletData } from "src/interfaces/IWallet";
import IWalletRepository from "./interface/IWalletRepository";
import { Model, Types } from "mongoose";
import { AppError } from "../../utils/errors";

class WalletRepository implements IWalletRepository {
  private readonly model: Model<IWallet>;

  constructor(model: Model<IWallet>) {
    this.model = model;
  }

  async create(walletData: Partial<WalletData>): Promise<IWallet> {
    try {
      const wallet = await this.model.create(walletData);
      if (!wallet) {
        throw new AppError("Failed to create wallet", 400);
      }
      return wallet;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async update(
    walletId: string,
    walletData: Partial<WalletData>
  ): Promise<IWallet> {
    try {
      const wallet = await this.model.findByIdAndUpdate(walletId, walletData, {
        new: true,
      });
      if (!wallet) {
        throw new AppError("Something went wrong");
      }
      return wallet;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async addTransaction(
    userId: string,
    transactionData: ITransaction
  ): Promise<IWallet> {
    const session = await this.model.startSession();
    session.startTransaction();

    try {
      const wallet = await this.model.findOneAndUpdate(
        { user: userId },
        {
          $push: { transactions: transactionData },
        },
        { session, new: true }
      );

      if (!wallet) {
        throw new AppError("Wallet not found", 404);
      }

      if (transactionData.status === "failed") {
        await session.commitTransaction();
        return wallet;
      }

      // update the balance for successull transaction
      const balanceUpdate =
        transactionData.type === "credit"
          ? transactionData.amount
          : -transactionData.amount;

      await this.model.findOneAndUpdate(
        { user: userId },
        {
          $inc: { balance: balanceUpdate },
        },
        { session, new: true }
      );

      await session.commitTransaction(); // commit the balance update
      return wallet;
    } catch (error) {
      await session.abortTransaction(); // rollback incase error
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    } finally {
      session.endSession();
    }
  }

  async findById(walletId: string): Promise<IWallet | null> {
    try {
      const wallet = await this.model.findById(walletId);
      return wallet;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }

  async findByUserId(userId: string): Promise<IWallet | null> {
    try {
      const wallet = await this.model.findOne({
        user: new Types.ObjectId(userId),
      });
      return wallet;
    } catch (error) {
      throw new AppError(
        `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
}

export default WalletRepository;
