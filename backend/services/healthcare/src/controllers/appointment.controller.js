import Appointment from '../models/Appointment.model.js';

// Process appointment request from Nexus Gateway
export const processAppointment = async (req, res) => {
  try {
    const { requestId, citizenId, citizenName, citizenEmail, data } = req.body;

    // Create appointment in Healthcare database
    const appointment = new Appointment({
      nexusRequestId: requestId,
      citizenId,
      citizenName,
      citizenEmail,
      doctorType: data.doctorType,
      preferredDate: new Date(data.preferredDate),
      preferredTime: data.preferredTime,
      symptoms: data.symptoms,
      status: 'PENDING'
    });

    await appointment.save();

    // Return PENDING status to Nexus
    res.json({
      success: true,
      status: 'PENDING',
      remarks: 'Your appointment request has been received and is pending review.',
      responseData: {
        appointmentId: appointment._id,
        doctorType: appointment.doctorType,
        preferredDate: appointment.preferredDate,
        preferredTime: appointment.preferredTime
      }
    });
  } catch (error) {
    console.error('Process appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process appointment request.'
    });
  }
};

// Update appointment status (called by Nexus when officer accepts/rejects)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { requestId, status, remarks, processedBy } = req.body;

    const appointment = await Appointment.findOne({ nexusRequestId: requestId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    appointment.status = status;
    appointment.remarks = remarks || '';
    appointment.processedBy = processedBy;
    appointment.processedAt = new Date();

    // Assign a doctor if accepted
    if (status === 'ACCEPTED') {
      const doctors = {
        general: 'Dr. Sarah Johnson',
        specialist: 'Dr. Michael Chen',
        dentist: 'Dr. Emily White',
        pediatrician: 'Dr. Robert Lee'
      };
      appointment.assignedDoctor = doctors[appointment.doctorType] || 'Dr. General Practitioner';
    }

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment status updated.',
      data: appointment
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status.'
    });
  }
};

// Get citizen's appointments
export const getCitizenAppointments = async (req, res) => {
  try {
    const citizenId = req.headers['x-citizen-id'] || req.query.citizenId;

    const appointments = await Appointment.find({ citizenId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get citizen appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments.'
    });
  }
};

// Get all appointments (for department officers)
export const getAllAppointments = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = status ? { status } : {};

    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments.'
    });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment.'
    });
  }
};

// Legacy exports for backward compatibility
export const createAppointment = processAppointment;
export const getAppointments = getAllAppointments;
