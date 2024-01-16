import express from "express";
import { WalletModel } from "../models/walletModels.js";

const router = express.Router();
router.get("/get-wallet-details", async (req, res) => {
  try {
    const { mobileNumber } = req.query;

    // Find the wallet for the user with the given mobile number
    const wallet = await WalletModel.findOne({ userId: mobileNumber });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found for the user",
      });
    }

    res.json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/add-money", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Find the wallet for the user
    const wallet = await WalletModel.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found for the user",
      });
    }

    // Update the wallet balance and add a transaction to the history
    wallet.walletBalance += amount;
    wallet.transactionHistory.push({
      transactionId: generateTransactionId(), // You can implement your own logic for generating a transaction ID
      timeOfTransaction: new Date().toLocaleString(),
      amountCredited: amount,
      status: "success",
      balance: wallet?.walletBalance,
    });

    // Save the updated wallet
    await wallet.save();

    res.json({
      success: true,
      message: "Money added to the wallet successfully",
      wallet,
    });
  } catch (error) {
    console.error("Error adding money to wallet:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/withdraw-money", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Find the wallet for the user
    const wallet = await WalletModel.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found for the user",
      });
    }

    // Check if the wallet balance is sufficient for the withdrawal
    if (wallet.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient funds for withdrawal",
      });
    }

    // Update the wallet balance and add a transaction to the history
    wallet.walletBalance -= amount;
    wallet.transactionHistory.push({
      transactionId: generateTransactionId(),
      timeOfTransaction: new Date().toLocaleString(),
      amountDebited: amount,
      status: "pending",
      balance: wallet?.walletBalance,
    });

    // Save the updated wallet
    await wallet.save();

    res.json({
      success: true,
      message: "Money withdrawn from the wallet successfully",
      wallet,
    });
  } catch (error) {
    console.error("Error withdrawing money from wallet:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Function to generate a transaction ID (you can customize this)
function generateTransactionId() {
  return Math.random().toString(36).substring(2, 15);
}

export { router as walletRouter };
