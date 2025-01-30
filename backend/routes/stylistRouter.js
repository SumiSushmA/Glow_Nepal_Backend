import express from 'express';
import {
    appointmentCancel,
    appointmentComplete,
    appointmentsStylist,
    changeAvailability,
    loginStylist,
    stylistDashboard,
    stylistList,
    stylistProfile,
    updateStylistProfile
} from '../controllers/stylistController.js';
import authStylist from '../middleware/authStylist.js';

const stylistRouter = express.Router();

stylistRouter.post("/login", loginStylist);
stylistRouter.post("/cancel-appointment", authStylist, appointmentCancel);
stylistRouter.get("/appointments", authStylist, appointmentsStylist);
stylistRouter.get("/list", stylistList);
stylistRouter.post("/change-availability", authStylist, changeAvailability);
stylistRouter.post("/complete-appointment", authStylist, appointmentComplete);
stylistRouter.get("/dashboard", authStylist, stylistDashboard);
stylistRouter.get("/profile", authStylist, stylistProfile);
stylistRouter.post("/update-profile", authStylist, updateStylistProfile);

export default stylistRouter;
