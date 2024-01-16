import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  isForSale: {
    type: Boolean,
    default: false,
  },
  imageURL: {
    type: String,
    default:
      "https://boschbrandstore.com/wp-content/uploads/2019/01/no-image.png",
  },
  numberOfTimesPurchased: {
    type: Number,
    default: 0,
  },
  businessId: { type: Schema.Types.ObjectId, ref: "business", required: true },
});
export const ProductsModel = model("products", ProductSchema);
