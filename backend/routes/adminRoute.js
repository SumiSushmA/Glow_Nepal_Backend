import express from 'express';
import {
    addStylist,
    adminDashboard,
    allStylists,
    appointmentCancel,
    appointmentsAdmin,
    loginAdmin
} from '../controllers/adminController.js';
import { changeAvailability } from '../controllers/stylistController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-stylist", authAdmin, upload.single('image'), addStylist);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/all-stylists", authAdmin, allStylists);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;
