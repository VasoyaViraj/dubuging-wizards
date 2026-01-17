import { randomUUID } from "crypto";
import Appointment from "../models/appointments.model.js";
import Patient from "../models/patient.model.js";

export const createAppointment = async (req, res) => {
  try {
    const {
      patientId,
      appointmentDate,
      timeSlot,
      symptoms,
    } = req.body;

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const appointment = await Appointment.create({
      appointmentId: randomUUID(),
      patient: patient._id,
      patientName: patient.name,
      mobileNumber: patient.mobileNumber,
      appointmentDate,
      timeSlot,
      symptoms,
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate("patient")
    .sort({ createdAt: -1 });

  res.json(appointments);
};
