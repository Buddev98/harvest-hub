import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Document, ObjectId, Types } from 'mongoose';
import MedicalRecord from '../models/MedicalModel';
import Prescription from '../models/PrescriptionModel';

interface IAppointment extends Document {
  doctorId: string;
  patientId: string;
  date: Date;
  timeSlot: string;
  status: string;
}

interface IPrescription extends Document {
  patientId: string;
  doctorId: string;
  medicines: string[];
  medicalRecordId?: ObjectId;
}

const medicalrecordController = {
  postmedicalrecord: async (req: Request, res: Response) => {
    try {
        const user = req.user as JwtPayload;
        const doctorId = user.id as string;
      const { patientId, diagnosis, treatment, notes, medicines } = req.body;

      const prescription = await Prescription.create({
        patientId,
        doctorId,
        medicines
      });

      const medicalRecord = await MedicalRecord.create({
        patientId,
        doctorId,
        diagnosis,
        treatment,
        notes,
        prescriptions: [prescription._id]
      });

      // Link prescription to medical record
      prescription.medicalRecordId = medicalRecord._id as Types.ObjectId;
      await prescription.save();

      res.status(201).json({ medicalRecord, prescription });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create record' });
    }
  },
};

export const { postmedicalrecord } = medicalrecordController;
export default medicalrecordController;