import { Schema, model } from "mongoose";

const BusinessSchema = new Schema({
  mobileNumber: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },
  businessType: {
    type: String,
    default: "shop",
  },
  email: {
    type: String,
    default: "ex@gmail.com",
  },
  userType: {
    type: String,
    default: "business",
  },
  location: {
    type: String,
    default: "https://maps.app.goo.gl/DtQ9434gWrPMPN556",
  },
  isOpened: {
    type: Boolean,
    default: false,
  },
  profileImageLink: {
    type: String,
    default: "https://i.stack.imgur.com/l60Hf.png",
  },
  about: {
    type: String,
    default: "",
  },
  timeOfRegistration: {
    type: String,
  },
  availableProducts: [
    { type: Schema.Types.ObjectId, ref: "products", default: [] },
  ],
  productsForSale: [
    { type: Schema.Types.ObjectId, ref: "products", default: [] },
  ],
  orders: {
    type: Array,
    default: [],
  },
  requests: {
    type: Array,
    default: [],
  },
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: { type: Number, default: 0 },
    },
  ],
  history: {
    type: Array,
    default: [],
  },
});
export const BusinessModel = model("business", BusinessSchema);
