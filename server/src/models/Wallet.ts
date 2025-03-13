import { model, Model, Schema } from "mongoose";
import { ITransaction, IWallet } from "src/interfaces/IWallet";

const transactionSchema = new Schema<ITransaction>({
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["credit", "debit"],
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
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

export const WalletModel: Model<IWallet> = model<IWallet>(
  "Wallet",
  walletSchema
);
