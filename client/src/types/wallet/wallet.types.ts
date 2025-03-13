export interface ITransaction {
  _id: string;
  amount: number;
  type: "credit" | "debit";
  status: "success" | "failed";
  date: Date;
  description: string;
}

export interface IWallet {
  _id: string;
  user: string;
  userType: "Patient" | "Doctor";
  balance: number;
  transactions: ITransaction[];
  createdAt: Date;
  updatedAt: Date;
}
