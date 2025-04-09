import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Appointment document
interface IAppointment extends Document {
  doctorId: mongoose.Schema.Types.ObjectId;
  patientId: mongoose.Schema.Types.ObjectId;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'canceled' | 'waitlisted';
  createdAt: Date;
}

// Define the schema for the Appointment model
const appointmentSchema: Schema<IAppointment> = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true }, // Example: '10:00 AM - 10:30 AM'
  status: {
    type: String,
    enum: ['confirmed', 'canceled', 'waitlisted'],
    default: 'confirmed'
  }, // 'waitlisted' acts as a waitlist entry
  createdAt: { type: Date, default: Date.now }
});

// Create the Appointment model
const Appointment = mongoose.model<IAppointment>("appointments", appointmentSchema);

export default Appointment;
