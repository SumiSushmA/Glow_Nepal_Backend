import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import validator from "validator";
import appointmentModel from "../models/appointmentModel.js";
import stylistModel from "../models/stylistModel.js";
import userModel from "../models/userModel.js";

// ✅ Middleware to Verify JWT Token
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // ✅ Extract userId from token
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

// ✅ API to Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
       console.log(req.body);

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid Email Format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered. Please log in." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        // ✅ Fix: Ensure token includes `userId`
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        console.log("✅ Generated Token:", token);
        console.log("✅ User ID in Token:", jwt.verify(token, process.env.JWT_SECRET));

        res.status(201).json({ success: true, token, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ API to Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

   
        if (!user) {
       
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        // ✅ Fix: Ensure token includes `userId`
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        console.log("✅ Generated Token:", token);
        console.log("✅ User ID in Token:", jwt.verify(token, process.env.JWT_SECRET));
        res.status(200).json({ success: true, token, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ API to Get User Profile (Using Token)
const getProfile = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId).select("-password");

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, userData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ API to Update User Profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.status(400).json({ success: false, message: "Data Missing" });
        }

        await userModel.findByIdAndUpdate(req.userId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender,
        });

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });

            await userModel.findByIdAndUpdate(req.userId, { image: imageUpload.secure_url });
        }

        res.status(200).json({ success: true, message: "Profile Updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ API to Book Appointment
const bookAppointment = async (req, res) => {
    try {
        const { stylistId, slotDate, slotTime } = req.body;
        const stylistData = await stylistModel.findById(stylistId).select("-password");

        if (!stylistData.available) {
            return res.status(400).json({ success: false, message: "Stylist Not Available" });
        }

        let slots_booked = stylistData.slots_booked;
        if (!slots_booked[slotDate]) {
            slots_booked[slotDate] = [];
        }
        slots_booked[slotDate].push(slotTime);

        const userData = await userModel.findById(req.userId).select("-password");

        const appointmentData = {
            userId: req.userId,
            stylistId,
            userData,
            stylistData,
            amount: stylistData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();
        await stylistModel.findByIdAndUpdate(stylistId, { slots_booked });

        res.status(200).json({ success: true, message: "Appointment Booked" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ API to Get User Appointments
const listAppointment = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ userId: req.userId });

        res.status(200).json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ API to Cancel Appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.userId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        res.status(200).json({ success: true, message: "Appointment Cancelled" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ API to Upload Image
const uploadImage = async (req, res) => {
    try {
        console.log(req.file);
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a file" });
        }
        res.status(200).json({ success: true, data: req.file.filename });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Exporting Functions
export { bookAppointment, cancelAppointment, getProfile, listAppointment, loginUser, registerUser, updateProfile, uploadImage, verifyToken };





