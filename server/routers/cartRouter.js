import express from "express";
import { BusinessModel } from "../models/businessModels.js";
import { UserModel } from "../models/userModels.js";
import mongoose from "mongoose";
import { ProductsModel } from "../models/productsModels.js";
import { WalletModel } from "../models/walletModels.js";
import { errorTypesObj } from "../common/errors.js";
const router = express.Router();

router.get("/cart-details", async (req, res) => {
  const { userId } = req.query;
  try {
    // Check if the user is a regular user or a business
    const user = await UserModel.findById(userId);
    const business = await BusinessModel.findById(userId);

    if (!user && !business) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (business) {
      // If the user is a business, return the business's cart details
      res.json({ success: true, cart: business.cart });
    } else {
      // If the user is a regular user, return the user's cart details
      res.json({ success: true, cart: user.cart });
    }
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/move-to-cart", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    // Check if the user is a regular user or a business
    const user = await UserModel.findById(userId);
    const business = await BusinessModel.findById(userId);

    if (!user && !business) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Validate if productId is a valid ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);

    if (!isValidObjectId) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid productId" });
    }

    if (business) {
      // If the user is a business, add the productId to the business's cart
      // If the user is a regular user, add the productId to the user's cart
      const existingCartItem = business.cart.find((item) =>
        item.productId.equals(productId)
      );

      if (existingCartItem) {
        // If the product already exists in the cart, increment the quantity by one
        existingCartItem.quantity += 1;
      } else {
        // If the product is not in the cart, add it with quantity 1
        business.cart.push({ productId, quantity: 1 });
      }

      // Save the updated business
      await business.save();

      res.json({ success: true, business });
    } else {
      // If the user is a regular user, add the productId to the user's cart
      const existingCartItem = user.cart.find((item) =>
        item.productId.equals(productId)
      );

      if (existingCartItem) {
        // If the product already exists in the cart, increment the quantity by one
        existingCartItem.quantity += 1;
      } else {
        // If the product is not in the cart, add it with quantity 1
        user.cart.push({ productId, quantity: 1 });
      }

      // Save the updated user
      await user.save();

      res.json({ success: true, user });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/decrement-from-cart", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await UserModel.findById(userId);
    const business = await BusinessModel.findById(userId);

    if (!user && !business) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);

    if (!isValidObjectId) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid productId" });
    }

    if (business) {
      const cartItem = business.cart.find((cartItem) =>
        cartItem.productId.equals(productId)
      );

      if (cartItem) {
        cartItem.quantity = Math.max(0, cartItem.quantity - 1);

        // Save the updated business
        await business.save();

        if (cartItem.quantity === 0) {
          // Remove the product from the cart if quantity is 0
          business.cart = business.cart.filter(
            (item) => !item.productId.equals(productId)
          );
          await business.save();
        }

        res.json({ success: true, business, quantity: cartItem.quantity });
      } else {
        res.json({ success: false, message: "Product not found in the cart" });
      }
    } else {
      const cartItem = user.cart.find((cartItem) =>
        cartItem.productId.equals(productId)
      );

      if (cartItem) {
        cartItem.quantity = Math.max(0, cartItem.quantity - 1);

        // Save the updated user
        await user.save();

        if (cartItem.quantity === 0) {
          // Remove the product from the cart if quantity is 0
          user.cart = user.cart.filter(
            (item) => !item.productId.equals(productId)
          );
          await user.save();
        }

        res.json({ success: true, user, quantity: cartItem.quantity });
      } else {
        res.json({ success: false, message: "Product not found in the cart" });
      }
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// router.post("/empty-cart", async (req, res) => {
//   const { userId } = req.body;

//   try {
//     // Check if the user is a regular user or a business
//     const user = await UserModel.findById(userId);
//     const business = await BusinessModel.findById(userId);

//     if (!user && !business) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     if (business) {
//       // If the user is a business, set the cart array to an empty array
//       business.cart = [];

//       // Save the updated business
//       await business.save();

//       res.json({ success: true, business });
//     } else {
//       // If the user is a regular user, set the cart array to an empty array
//       user.cart = [];

//       // Save the updated user
//       await user.save();

//       res.json({ success: true, user });
//     }
//   } catch (error) {
//     console.error("Error emptying cart:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// });
router.post("/empty-cart", async (req, res) => {
  const { userId, totalAmount, cart, product } = req.body;

  try {
    // Check if the user is a regular user or a business
    const user = await UserModel.findById(userId);
    const business = await BusinessModel.findById(userId);

    if (!user && !business) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let entity; // Variable to store the user or business entity

    if (business) {
      entity = business;
    } else {
      entity = user;
    }

    // Create an order object based on the current cart
    const order = {
      items: entity.cart.map((cartItem) => ({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      })),
      totalAmount: totalAmount,
      orderDate: new Date().toLocaleString(),
    };

    // Add the order to the history
    entity.history.push(order);

    // Set the cart array to an empty array
    entity.cart = [];

    // Save the updated entity
    await entity.save();

    res.json({
      success: true,
      entity,
      message: "Order processed successfully",
    });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/test", async (req, res) => {
  const { cart, product } = req.body;

  try {
    // Loop through each item in the cart
    for (const item of cart) {
      const business_id = product.find(
        (data) => item.productId === data._id
      ).businessId;
      const quantity = item.quantity;
      const productId = item.productId;

      // Decrement the product quantity
      await ProductsModel.findByIdAndUpdate(productId, {
        $inc: { stockQuantity: -quantity },
      });

      // Add details to business.orders
      const business = await BusinessModel.findById(business_id);

      // Assuming 'order' is an object containing details about the order
      const order = {
        productId,
        quantity,
      };

      business.orders.push(order);

      // Save the updated business
      await business.save();
    }

    res.json({ success: true, message: "Order processed successfully" });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/process-order", async (req, res) => {
  const { userId, totalAmount, cart, product, addressDetails } = req.body;

  try {
    // Check if the user is a regular user or a business
    const user = await UserModel.findById(userId);
    const business = await BusinessModel.findById(userId);

    if (!user && !business) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let entity; // Variable to store the user or business entity

    if (business) {
      entity = business;
    } else {
      entity = user;
    }
    //check for the wallet
    // Find the wallet for the user
    const wallet = await WalletModel.findOne({ userId: entity.mobileNumber });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found for the user",
      });
    }
    if (wallet.walletBalance >= totalAmount) {
      // Create an order object based on the current cart
      const order = {
        items: entity.cart.map((cartItem) => ({
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          address: addressDetails,
        })),
        totalAmount: totalAmount,
        orderDate: new Date().toLocaleString(),
      };

      // Add the order to the history
      entity.history.push(order);

      // Set the cart array to an empty array
      entity.cart = [];

      // Save the updated entity
      await entity.save();
      // Loop through each item in the cart

      for (const item of cart) {
        const business_id = product.find(
          (data) => item.productId === data._id
        ).businessId;

        const quantity = item.quantity;
        const productId = item.productId;

        // Decrement the product quantity
        await ProductsModel.findByIdAndUpdate(
          productId,
          {
            $inc: { stockQuantity: -quantity },
          },
          { new: true }
        );

        //fetch product details
        const productInfo = await ProductsModel.findOne({ _id: productId });
        if (!productInfo) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
          });
        }
        // Add details to business.orders

        if (productInfo) {
          console.log("productIInfo");
          const businessProducts = await BusinessModel.findById(
            productInfo.businessId
          );
          // Assuming 'order' is an object containing details about the order
          const order = {
            productId,
            quantity,
            address: addressDetails,
          };

          businessProducts.orders.push(order);
          const businessWallet = await WalletModel.findOne({
            userId: businessProducts.mobileNumber,
          });

          if (!businessWallet) {
            return res.status(404).json({
              success: false,
              message: "Wallet not found for the user",
            });
          }
          // Update the wallet balance and add a transaction to the history
          businessWallet.walletBalance += productInfo?.price * item.quantity;

          businessWallet.transactionHistory.push({
            transactionId: generateTransactionId(), // You can implement your own logic for generating a transaction ID
            timeOfTransaction: new Date().toLocaleString(),
            amountCredited: productInfo?.price * item.quantity,
            status: "success",
            balance: businessWallet?.walletBalance,
          });

          // Save the updated wallet
          await businessWallet.save();

          // Save the updated business
          await businessProducts.save();
        }
      }

      // Update the wallet balance and add a transaction to the history
      wallet.walletBalance -= totalAmount;
      wallet.transactionHistory.push({
        transactionId: generateTransactionId(),
        timeOfTransaction: new Date().toLocaleString(),
        amountDebited: totalAmount,
        status: "done",
        balance: wallet?.walletBalance,
      });

      // Save the updated wallet
      await wallet.save();
    } else {
      return res.status(400).json({
        success: false,
        error: "Insufficient funds for withdrawal",
        errorType: errorTypesObj.INSUFFICIENT_FUNDS,
      });
    }

    res.json({
      success: true,
      entity,
      message: "Order processed successfully",
    });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

function generateTransactionId() {
  return Math.random().toString(36).substring(2, 15);
}

export { router as cartRouter };
