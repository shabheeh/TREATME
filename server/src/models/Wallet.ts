import { model, Model, Schema } from "mongoose";
import { ITransaction, IWallet } from "src/interfaces/IWallet";

const transactionSchema = new Schema<ITransaction>({
  walletId: {
    type: Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["credit", "debit", "request"],
    required: true,
  },
  status: {
    type: String,
    enum: ["success", "failed", "pending"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: false,
  },
});

const walletSchema = new Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      refPath: "userType",
      required: true,
    },
    userType: {
      type: String,
      enum: ["Patient", "Doctor"],
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const WalletModel: Model<IWallet> = model<IWallet>(
  "Wallet",
  walletSchema
);

export const TransactionModel: Model<ITransaction> = model<ITransaction>(
  "Transaction",
  transactionSchema
);
