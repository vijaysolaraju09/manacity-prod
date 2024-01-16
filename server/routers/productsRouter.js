import express from "express";
import { ProductsModel } from "../models/productsModels.js";
import { BusinessModel } from "../models/businessModels.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

router.get("/all-products", async (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res
        .status(400)
        .json({ success: false, error: "BusinessId is required" });
    }

    const products = await ProductsModel.find({ businessId });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/fetch-product-details", async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or missing product IDs" });
    }

    const productDetails = await ProductsModel.find({
      _id: { $in: productIds },
    });

    res.json({ success: true, productDetails });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/add-product", upload.single("productImage"), async (req, res) => {
  const {
    productName,
    price,
    description,
    stockQuantity,
    businessId,
    isForSale,
  } = req.body;

  try {
    let imageURL =
      "https://boschbrandstore.com/wp-content/uploads/2019/01/no-image.png";
    if (req.file) {
      const uploadedObj = await cloudinary.uploader.upload(req.file.path);
      imageURL = uploadedObj.secure_url;
    }

    const newProduct = new ProductsModel({
      productName,
      price,
      description,
      stockQuantity,
      businessId,
      isForSale,
      imageURL,
    });

    await newProduct.save();

    // Update the business with the new product reference
    const business = await BusinessModel.findById(businessId);
    if (isForSale) {
      business.productsForSale.push(newProduct._id);
    } else {
      business.availableProducts.push(newProduct._id);
    }
    await business.save();

    res.json({ success: true, newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/remove-product", async (req, res) => {
  const { productId } = req.body;
  try {
    // Remove the product from the ProductsModel
    const removedProduct = await ProductsModel.findOneAndDelete({
      _id: productId,
    });

    if (!removedProduct) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    // Remove the product reference from the business
    const business = await BusinessModel.findOne({
      _id: removedProduct.businessId,
    });
    if (removedProduct.isForSale) {
      business.productsForSale = business.productsForSale.filter(
        (id) => id.toString() !== productId
      );
    } else {
      business.availableProducts = business.availableProducts.filter(
        (id) => id.toString() !== productId
      );
    }

    await business.save();

    res.json({ success: true, removedProduct });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export { router as productsRouter };
