import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    patientName: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },

    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },

    timeSlot: {
      type: String,
      required: true,
    },

    symptoms: {
      type: String,
    },

    status: {
      type: String,
      enum: ["REQUESTED", "CONFIRMED", "CLOSED"],
      default: "REQUESTED",
      index: true,
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Appointment", AppointmentSchema);
