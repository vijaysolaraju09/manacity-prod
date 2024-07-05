import { Schema, model } from "mongoose";

const WalletSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  walletBalance: {
    type: Number,
    default: 100,
  },
  transactionHistory: [
    {
      transactionId: {
        type: String,
        required: true,
      },
      timeOfTransaction: {
        type: String,
        default: Date.now,
      },
      amountDebited: {
        type: Number,
        default: 0,
      },
      amountCredited: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        default: "success",
      },
      balance: {
        type: Number,
        default: 0,
      },
    },
  ],
});

export const WalletModel = model("wallet", WalletSchema);
