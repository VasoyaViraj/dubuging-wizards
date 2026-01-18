import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    // Reference to Nexus request ID
    nexusRequestId: {
        type: String,
        required: true,
        index: true
    },
    citizenId: {
        type: String,
        required: true,
        index: true
    },
    citizenName: {
        type: String,
        required: true
    },
    citizenEmail: {
        type: String
    },
    doctorType: {
        type: String,
        required: true,
        enum: ['general', 'specialist', 'dentist', 'pediatrician']
    },
    preferredDate: {
        type: Date,
        required: true
    },
    preferredTime: {
        type: String,
        required: true
    },
    symptoms: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    assignedDoctor: {
        type: String,
        default: null
    },
    remarks: {
        type: String,
        default: ''
    },
    processedBy: {
        type: String,
        default: null
    },
    processedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
