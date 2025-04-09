import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the DoctorAvailability document
interface IDoctorAvailability extends Document {
  doctorId: mongoose.Schema.Types.ObjectId;
  availableSlots: { date: string; timeSlots: string[] }[];
}

// Create the schema
const doctorAvailabilitySchema: Schema = new Schema({
  doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  availableSlots: [{ date: String, timeSlots: [String] }]
});

// Create the model
export default mongoose.model<IDoctorAvailability>('availability', doctorAvailabilitySchema);

