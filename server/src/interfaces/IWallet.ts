import { Document, Types } from "mongoose";

export interface ITransaction extends Document {
  walletId: Types.ObjectId;
  amount: number;
  type: "credit" | "debit" | "request";
  status: "success" | "failed" | "pending";
  date: Date;
  description: string;
}

export interface IWallet extends Document {
  user: Types.ObjectId;
  userType: "Patient" | "Doctor";
  balance: number;
}

export type WalletData = {
  user: string;
  userType: "Patient" | "Doctor";
  balance: number;
};

export type TransactionData = {
  amount: number;
  type: "credit" | "debit" | "request";
  status: "success" | "failed" | "pending";
  date: Date;
  description: string;
};
