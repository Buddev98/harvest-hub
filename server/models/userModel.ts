import mongoose, { Schema } from "mongoose";

interface User extends Document {
  username: string;
  password: string;
  role: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  exerience: string;
  specialization?: string;
  MedicalHistory?: string[];
  refreshToken: string;
}

const userSchema: Schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  role: { type: String, enum: ['admin', 'patient'], default: 'patient' },
  email: { type: String, required: false, unique: true },
  phone: { type: String, required: true },
  refreshToken: { type: String, default: '' },
  gender: { type: String },
  exerience: { type: String },
  specialization: { type: String } 
}, { timestamps: true });


export default mongoose.model<User>('users', userSchema);