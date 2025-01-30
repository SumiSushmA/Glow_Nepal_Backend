import cors from "cors";
import "dotenv/config";
import express from "express";
import connectCloudinary from "./backend/config/cloudinary.js";
import connectDB from "./backend/config/mongodb.js";
import adminRouter from "./backend/routes/adminRoute.js";
import stylistRouter from "./backend/routes/stylistRouter.js";
import userRouter from "./backend/routes/userRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/stylist", stylistRouter); 

app.get("/", (req, res) => {
  res.send("GlowNepal API is Running");
});

app.listen(port, () => console.log(`Server started on PORT: ${port}`));
