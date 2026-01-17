import { randomUUID } from "crypto";
import Patient from "../models/patient.model.js";

export const createPatient = async (req, res) => {
  try {
    const { name, mobileNumber, symptoms } = req.body;

    const patient = await Patient.create({
      patientId: randomUUID(),
      name,
      mobileNumber,
      symptoms,
    });

    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPatients = async (req, res) => {
  const patients = await Patient.find().sort({ createdAt: -1 });
  res.json(patients);
};
