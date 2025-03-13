import { Document, Types } from "mongoose";

export interface ITransaction {
  amount: number;
  type: "credit" | "debit";
  status: "success" | "failed";
  date: Date;
  description: string;
}

export interface IWallet extends Document {
  user: Types.ObjectId;
  userType: "Patient" | "Doctor";
  balance: number;
  transactions: ITransaction[];
}

export type WalletData = {
  user: string;
  userType: "Patient" | "Doctor";
  balance: number;
  transactions: ITransaction[];
};
