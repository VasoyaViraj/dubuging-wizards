import express from "express";
import {
  createPatient,
  getPatients,
} from "../controllers/patient.controller.js";

const router = express.Router();

router.post("/", createPatient);
router.get("/", getPatients);

export default router;
