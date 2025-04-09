import mongoose, { Schema, Document } from 'mongoose';
 
export interface IPrescription extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  medicines: string;
  date: Date;
  medicalRecordId?: mongoose.Types.ObjectId; // links to medical record
}
 
const prescriptionSchema: Schema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  medicines: { type: String, required: true },
  date: { type: Date, default: Date.now },
  medicalRecordId: { type: Schema.Types.ObjectId, ref: 'MedicalRecord' }
});
 
 const Prescription = mongoose.model<IPrescription>('Prescription', prescriptionSchema);
 export default Prescription;