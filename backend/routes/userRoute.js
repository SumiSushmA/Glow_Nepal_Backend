import express from 'express';
import {
    bookAppointment,
    cancelAppointment,
    getProfile,
    listAppointment,
    loginUser,
    // paymentRazorpay,
    // paymentStripe,
    registerUser,
    updateProfile,
} from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", authUser, upload.single('image'), updateProfile);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);

// userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
// userRouter.post("/verify-razorpay", authUser, verifyRazorpay);
// userRouter.post("/payment-stripe", authUser, paymentStripe);
// userRouter.post("/verify-stripe", authUser, verifyStripe);

export default userRouter;
