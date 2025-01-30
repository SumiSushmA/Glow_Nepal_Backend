import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import stylistModel from "../models/stylistModel.js";

// API for stylist login 
const loginStylist = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await stylistModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get stylist appointments for stylist panel
const appointmentsStylist = async (req, res) => {
    try {
        const { stylistId } = req.body;
        const appointments = await appointmentModel.find({ stylistId });

        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to cancel appointment for stylist panel
const appointmentCancel = async (req, res) => {
    try {
        const { stylistId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (appointmentData && appointmentData.stylistId === stylistId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            return res.json({ success: true, message: 'Appointment Cancelled' });
        }

        res.json({ success: false, message: 'Appointment Not Found' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to mark appointment completed for stylist panel
const appointmentComplete = async (req, res) => {
    try {
        const { stylistId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (appointmentData && appointmentData.stylistId === stylistId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.json({ success: true, message: 'Appointment Completed' });
        }

        res.json({ success: false, message: 'Appointment Not Found' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all stylists list for frontend
const stylistList = async (req, res) => {
    try {
        const stylists = await stylistModel.find({}).select(['-password', '-email']);
        res.json({ success: true, stylists });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to change stylist availability for admin and stylist panel
const changeAvailability = async (req, res) => {
    try {
        const { stylistId } = req.body;

        const stylistData = await stylistModel.findById(stylistId);
        await stylistModel.findByIdAndUpdate(stylistId, { available: !stylistData.available });
        res.json({ success: true, message: 'Availability Changed' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get stylist profile for stylist panel
const stylistProfile = async (req, res) => {
    try {
        const { stylistId } = req.body;
        const profileData = await stylistModel.findById(stylistId).select('-password');

        res.json({ success: true, profileData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update stylist profile data from stylist panel
const updateStylistProfile = async (req, res) => {
    try {
        const { stylistId, fees, address, available } = req.body;

        await stylistModel.findByIdAndUpdate(stylistId, { fees, address, available });

        res.json({ success: true, message: 'Profile Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get dashboard data for stylist panel
const stylistDashboard = async (req, res) => {
    try {
        const { stylistId } = req.body;

        const appointments = await appointmentModel.find({ stylistId });

        let earnings = 0;
        let users = [];

        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
            if (!users.includes(item.userId)) {
                users.push(item.userId);
            }
        });

        const dashData = {
            earnings,
            appointments: appointments.length,
            users: users.length,
            latestAppointments: appointments.reverse()
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    appointmentCancel, appointmentComplete, appointmentsStylist, changeAvailability, loginStylist, stylistDashboard, stylistList, stylistProfile,
    updateStylistProfile
};

