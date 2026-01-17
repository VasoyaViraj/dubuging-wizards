import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
      index: true,
    },

    symptoms: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Patient", PatientSchema);
