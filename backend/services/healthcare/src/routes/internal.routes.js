import express from 'express';
import { verifyServiceJwt } from '../middlewares/verifyServiceJwt.middleware.js';
import {
  processAppointment,
  updateAppointmentStatus,
  getCitizenAppointments,
  getAllAppointments,
  getAppointmentById
} from '../controllers/appointment.controller.js';

const router = express.Router();

// All internal routes require service JWT verification
router.use(verifyServiceJwt);

// Process new appointment request from Nexus
router.post('/appointments', processAppointment);

// Update appointment status (accept/reject from Nexus)
router.post('/update-status', updateAppointmentStatus);

// Get citizen's appointments
router.get('/appointments/citizen', getCitizenAppointments);

// Get all appointments
router.get('/appointments', getAllAppointments);

// Get appointment by ID
router.get('/appointments/:id', getAppointmentById);

export default router;
