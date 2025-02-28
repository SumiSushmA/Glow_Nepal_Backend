import cors from "cors";
import "dotenv/config";
import express from "express";
import connectCloudinary from "../backend/config/cloudinary.js";
import connectDB from "../backend/config/mongodb.js";
import adminRouter from "../backend/routes/adminRoute.js";
import stylistRouter from "../backend/routes/stylistRouter.js";
import userRouter from "../backend/routes/userRoute.js";

// Create an Express app for testing
const app = express();

connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/stylist", stylistRouter);

app.get("/", (req, res) => {
  res.send("GlowNepal API is Running");
});

// Export the app without starting the server
export default app;
