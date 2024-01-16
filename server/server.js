import express from "express";
import mongoose from "mongoose";

import { MongoClient, ServerApiVersion } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import { userRouter } from "./routers/userRouter.js";
import { businessRouter } from "./routers/businessRouter.js";
import { productsRouter } from "./routers/productsRouter.js";
import { cartRouter } from "./routers/cartRouter.js";
import { walletRouter } from "./routers/walletRouter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "10mb" }));
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

process.on("SIGINT", () => {
  db.close(() => {
    console.log("MongoDB connection closed due to application termination");
    process.exit(0);
  });
});
app.use("/api", userRouter);
app.use("/api", businessRouter);
app.use("/api", productsRouter);
app.use("/api", cartRouter);
app.use("/api", walletRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
