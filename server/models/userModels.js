import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  mobileNumber: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },

  email: {
    type: String,
    default: "ex@gmail.com",
  },
  userType: {
    type: String,
    default: "customer",
  },
  location: {
    type: String,
    default: "rayachoty",
  },
  profileImageLink: {
    type: String,
    default: "https://i.stack.imgur.com/l60Hf.png",
  },
  about: {
    type: String,
    default: "",
  },
  occupation: {
    type: String,
    default: "none",
  },
  timeOfRegistration: {
    type: String,
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
export const UserModel = model("user", UserSchema);
