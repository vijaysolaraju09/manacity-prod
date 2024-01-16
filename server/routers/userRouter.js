import express from "express";

const router = express.Router();
import { UserModel } from "../models/userModels.js";
import { BusinessModel } from "../models/businessModels.js";
import { WalletModel } from "../models/walletModels.js";

router.post("/validate-user", async (req, res) => {
  const { mobileNumber } = req.body;
  try {
    const existingUser = await UserModel.findOne({ mobileNumber });
    const existingBusiness = await BusinessModel.findOne({ mobileNumber });

    if (existingUser || existingBusiness) {
      // User exists, return success
      res.json({ success: true, existingUser, existingBusiness });
    } else {
      // User does not exist, return failure
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error validating user:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/register-user", async (req, res) => {
  const { mobileNumber, name, userType, timeOfRegistration } = req.body;
  try {
    const newUser = new UserModel({
      mobileNumber,
      name,
      userType,
      timeOfRegistration,
    });

    const newWallet = new WalletModel({ mobileNumber });

    // Save the wallet and user to the database
    await newWallet.save();
    await newUser.save();

    // User registered successfully
    res.json({ success: true, newUser, newWallet });
    console.log(newUser, "registered successfully");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/user-details", async (req, res) => {
  const { phoneNumber } = req.query;
  try {
    const user = await UserModel.findOne({ mobileNumber: phoneNumber });
    const businessUser = await BusinessModel.findOne({
      mobileNumber: phoneNumber,
    });

    if (user) {
      res.json({ success: true, user });
    } else if (businessUser) {
      res.json({ success: true, user: businessUser });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/update-user", async (req, res) => {
  const { phoneNumber, email, name, location, about, occupation } = req.body;

  try {
    // Find the user by phone number
    const user = await UserModel.findOne({ mobileNumber: phoneNumber });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update user details
    user.email = email || user.email;
    user.name = name || user.name;
    user.location = location || user.location;
    user.about = about || user.about;
    user.occupation = occupation || user.occupation;

    // Save the updated user
    await user.save();

    // Send the updated user details in the response
    res.json({ success: true, updatedUser: user });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
export { router as userRouter };
