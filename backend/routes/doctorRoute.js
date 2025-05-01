import express from 'express';
import { loginDoctor, appointmentsDoctor, appointmentCancel, doctorList, changeAvailablity, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile, getVaccines } from '../controllers/doctorController.js';
import { searchChildByAadhar, addVaccinationRecord, updateVaccinationStatus, getVaccinationHistory } from '../controllers/vaccineRecordController.js';

import authDoctor from '../middleware/authDoctor.js';
const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.get("/list", doctorList);
doctorRouter.post("/change-availability", authDoctor, changeAvailablity);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);

// New vaccine record routes
doctorRouter.post("/search-child", authDoctor, searchChildByAadhar);
doctorRouter.post("/add-vaccination-record", authDoctor, addVaccinationRecord);
doctorRouter.post("/update-vaccination-status", authDoctor, updateVaccinationStatus);
doctorRouter.get("/vaccination-history/:aadharNumber", authDoctor, getVaccinationHistory);
doctorRouter.get('/vaccines', authDoctor, getVaccines);




export default doctorRouter;