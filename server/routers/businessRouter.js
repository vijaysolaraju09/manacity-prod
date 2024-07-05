import express from "express";
import dotenv from "dotenv";
import { BusinessModel } from "../models/businessModels.js";
import { WalletModel } from "../models/walletModels.js";
import cloudinary from "cloudinary";

import { upload } from "../middlewares/multer.middleware.js";
import { errorTypesObj } from "../common/errors.js";

const router = express.Router();

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

router.get("/all-businesses", async (req, res) => {
  try {
    const businesses = await BusinessModel.find();
    res.json({ success: true, businesses });
  } catch (error) {
    console.error("Error fetching all businesses:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/validate-business", async (req, res) => {
  const { mobileNumber } = req.body;
  try {
    const existingUser = await BusinessModel.findOne({ mobileNumber });

    if (existingUser) {
      // User exists, return success
      res.json({ success: true, existingUser });
    } else {
      // User does not exist, return failure
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error validating user:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/register-business", async (req, res) => {
  const { mobileNumber, name, timeOfRegistration, userType } = req.body;
  try {
    const newBusiness = new BusinessModel({
      mobileNumber,
      name,
      userType,
      timeOfRegistration,
    });
    const newWallet = new WalletModel({ userId: mobileNumber });

    // Save the wallet and business to the database
    await newWallet.save();
    await newBusiness.save();

    // User registered successfully
    res.json({ success: true, newBusiness, newWallet });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/business-details", async (req, res) => {
  const { businessId } = req.query;
  try {
    const user = await BusinessModel.findOne({ _id: businessId });

    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/update-business", async (req, res) => {
  const {
    phoneNumber,
    email,
    name,
    location,
    about,
    businessType,
    profileUploadDataData,
  } = req.body;
  try {
    // Find the business by phone number
    const business = await BusinessModel.findOne({
      mobileNumber: phoneNumber,
    });

    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update business details
    business.email = email || business.email;
    business.name = name || business.name;
    business.location = location || business.location;
    business.about = about || business.about;
    business.businessType = businessType || business.businessType;

    // Save the updated user
    await business.save();

    // Send the updated user details in the response
    res.json({ success: true, updatedUser: business });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
router.post(
  "/update-profile-picture",
  upload.single("profileImage"),
  async (req, res) => {
    const { phoneNumber } = req.query;
    try {
      // Find the business by phone number
      const business = await BusinessModel.findOne({
        mobileNumber: phoneNumber,
      });
      if (!business) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      // Update profile image if a new image is uploaded
      const uploadedObj = await cloudinary.uploader.upload(req.file.path);
      business.profileImageLink =
        uploadedObj.secure_url || business.profileImageLink;
      // Save the updated user
      await business.save();
      // Send the updated user details in the response
      res.json({ success: true, updatedUser: business });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        errorType: errorTypesObj.PROFILE_PICTURE_UPDATE_ERROR,
      });
    }
  }
);
export { router as businessRouter };
