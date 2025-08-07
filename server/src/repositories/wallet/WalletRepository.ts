import { IWallet, ITransaction, TransactionData } from "src/interfaces/IWallet";
import { Model, Types, ClientSession } from "mongoose";
import {
  AppError,
  BadRequestError,
  handleTryCatchError,
} from "../../utils/errors";
import IWalletRepository, {
  TransactionsPagination,
} from "./interface/IWalletRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/inversifyjs.types";
import { HttpStatusCode } from "../../constants/httpStatusCodes";

@injectable()
class WalletRepository implements IWalletRepository {
  private readonly walletModel: Model<IWallet>;
  private readonly transactionModel: Model<ITransaction>;

  constructor(
    @inject(TYPES.WalletModel) walletModel: Model<IWallet>,
    @inject(TYPES.TransactionModel) transactionModel: Model<ITransaction>
  ) {
    this.walletModel = walletModel;
    this.transactionModel = transactionModel;
  }

  async createWallet(
    userId: string,
    userType: "Patient" | "Doctor"
  ): Promise<IWallet> {
    try {
      const wallet = await this.walletModel.create({
        user: userId,
        userType,
        balance: 0,
      });
      return wallet;
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async findWalletByUserId(userId: string): Promise<IWallet | null> {
    try {
      return await this.walletModel.findOne({
        user: new Types.ObjectId(userId),
      });
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async addTransaction(
    userId: string,
    transactionData: TransactionData
  ): Promise<ITransaction> {
    const session: ClientSession = await this.walletModel.startSession();
    session.startTransaction();

    try {
      const wallet = await this.walletModel
        .findOne({ user: userId })
        .session(session);
      if (!wallet)
        throw new AppError("Wallet not found", HttpStatusCode.NOT_FOUND);

      const transaction = await this.transactionModel.create(
        [{ ...transactionData, walletId: wallet._id }],
        { session }
      );

      if (transactionData.status === "success") {
        if (
          transactionData.type === "debit" &&
          wallet.balance < transactionData.amount
        ) {
          throw new BadRequestError("Insuffient Wallet balance");
        }
        const balanceUpdate =
          transactionData.type === "credit"
            ? transactionData.amount
            : -transactionData.amount;
        await this.walletModel.updateOne(
          { _id: wallet._id },
          { $inc: { balance: balanceUpdate } },
          { session }
        );
      }

      await session.commitTransaction();
      return transaction[0];
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    } finally {
      session.endSession();
    }
  }

  async updateTransaction(
    transactionId: string,
    updatedData: Partial<TransactionData>
  ): Promise<ITransaction> {
    const session: ClientSession = await this.walletModel.startSession();
    session.startTransaction();

    try {
      const existingTransaction = await this.transactionModel
        .findById(transactionId)
        .session(session);
      if (!existingTransaction)
        throw new AppError("Transaction not found", HttpStatusCode.NOT_FOUND);

      const wallet = await this.walletModel
        .findById(existingTransaction.walletId)
        .session(session);
      if (!wallet)
        throw new AppError("Wallet not found", HttpStatusCode.NOT_FOUND);

      if (existingTransaction.status === "success") {
        const reverseBalance =
          existingTransaction.type === "credit"
            ? -existingTransaction.amount
            : existingTransaction.amount;

        await this.walletModel.updateOne(
          { _id: wallet._id },
          { $inc: { balance: reverseBalance } },
          { session }
        );
      }

      const updatedTransaction = await this.transactionModel.findByIdAndUpdate(
        transactionId,
        { $set: updatedData },
        { new: true, session }
      );

      if (!updatedTransaction)
        throw new AppError(
          "Failed to update transaction",
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );

      if (updatedTransaction.status === "success") {
        if (
          updatedTransaction.type === "debit" &&
          wallet.balance < updatedTransaction.amount
        ) {
          throw new BadRequestError("Insufficient wallet balance");
        }

        const newBalanceChange =
          updatedTransaction.type === "credit"
            ? updatedTransaction.amount
            : -updatedTransaction.amount;

        await this.walletModel.updateOne(
          { _id: wallet._id },
          { $inc: { balance: newBalanceChange } },
          { session }
        );
      }

      await session.commitTransaction();
      return updatedTransaction;
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    } finally {
      session.endSession();
    }
  }

  async getTransactionsByWalletId(
    walletId: string,
    page: number = 1
  ): Promise<{
    transactions: ITransaction[];
    pagination: TransactionsPagination;
  }> {
    try {
      const limit = 10;
      const skip = (page - 1) * limit;

      const totalTransactions = await this.transactionModel.countDocuments({
        walletId: new Types.ObjectId(walletId),
      });

      const transactions = await this.transactionModel
        .find({ walletId: new Types.ObjectId(walletId) })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(totalTransactions / limit);
      const pagination: TransactionsPagination = {
        page,
        totalTransactions,
        totalPages,
      };

      return { transactions, pagination };
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getTransactions(): Promise<ITransaction[]> {
    try {
      return await this.transactionModel.find();
    } catch (error) {
      handleTryCatchError("Database", error);
    }
  }

  async getWalletWithTransactions(
    userId: string
  ): Promise<{ wallet: IWallet; transactions: ITransaction[] } | null> {
    try {
      const wallet = await this.walletModel.findOne({
        user: new Types.ObjectId(userId),
      });

      if (!wallet) {
        throw new AppError("Wallet not found", HttpStatusCode.NOT_FOUND);
      }

      const transactions = await this.transactionModel
        .find({ walletId: wallet._id })
        .sort({ date: -1 });

      return { wallet, transactions };
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleTryCatchError("Database", error);
    }
  }
}

export default WalletRepository;
