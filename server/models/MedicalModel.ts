import mongoose, { Schema, Document } from 'mongoose';
 
export interface IMedicalRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  diagnosis: string;
  treatment: string;
  notes: string;
  prescriptions: mongoose.Types.ObjectId[]; // references Prescription model
  date: string;
}
 
const medicalRecordSchema: Schema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  notes: String,
  prescriptions: [{ type: Schema.Types.ObjectId, ref: 'Prescription' }],
  date: { type: String, default: Date.now }
});
 
 const MedicalRecord = mongoose.model<IMedicalRecord>('medicalRecord', medicalRecordSchema);
 export default MedicalRecord;