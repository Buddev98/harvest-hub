import { Request, Response } from 'express';
import availabilityModel from "../models/availabilityModel";
import mongoose from 'mongoose';
import AppointModel from "../models/AppointModel"
import { JwtPayload } from 'jsonwebtoken';
import userModel from '../models/userModel';

interface IAppointment extends Document {
  doctorId: string;
  patientId: string;
  date: Date;
  timeSlot: string;
  status: string;
}
const availabilityController = {
  createSlot: async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const doctorId = user.id as string;
    const { date, timeSlots } = req.body;

    try {
        // Check if the doctor exists in the users collection
        const doctorExists = await userModel.findById(doctorId);
        const timeSlotsArr = timeSlots.split(', ');

        if (!doctorExists) {
          res.status(404).json({ message: 'Doctor not found.' });
        }
    
        // Check if availability data exists for the doctor
        let availability = await availabilityModel.findOne({ doctorId: new mongoose.Types.ObjectId(doctorId) });
        
        if (!availability) {
          // Create new availability data if it doesn't exist
          availability = new availabilityModel({
            doctorId: new mongoose.Types.ObjectId(doctorId),
            availableSlots: [{ date, timeSlots: timeSlotsArr }]
          });
          await availability.save();
          res.status(201).json(availability);
        }
    
        // Check if the date already exists
        const existingDate = availability.availableSlots.find(slot => slot.date === date);
    
        if (existingDate) {
          // Check if the time slot already exists for the date
          const existingTimeSlot = timeSlotsArr.some((slot: string) => existingDate.timeSlots.includes(slot));
    
          if (existingTimeSlot) {
            res.status(400).json({ message: 'Time slot already exists for this date.' });
          } else {
            // Push the new time slot to the existing date's time slots array
            existingDate.timeSlots = [...existingDate?.timeSlots, ...timeSlotsArr];
            await availability.save();  
            res.status(201).json(availability);
          }
        } else {
          // Add the new slot to the availableSlots array
          availability.availableSlots.push({ date, timeSlots: timeSlotsArr });
          await availability.save();
          res.status(201).json(availability);
        }
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
  },
  getSlots: async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const userId = user.id;
    try {
      const availabilities = await availabilityModel.findOne({ doctorId: new mongoose.Types.ObjectId(userId) });
      res.status(200).json(availabilities);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getdoctoravailability: async (req: Request, res: Response) => {
    try {
      const { doctorId, date } = req.params;
      const formattedDate = date;

      const availability = await availabilityModel.findOne({
        doctorId,
        "availableSlots.date": formattedDate
      });

      if (!availability) {
         res.status(200).json({ availableSlots: [] });
         return;
      }

      const dateEntry = availability.availableSlots.find(
        d => d.date === formattedDate
      );

      const allSlots = dateEntry?.timeSlots || [];

      // Get already booked slots
      const bookedAppointments = await AppointModel.find({
        doctorId,
        date: { $gte: formattedDate, $lt: formattedDate + "T23:59:59" },
        status: { $in: ['confirmed', 'waiting'] }
      }) as IAppointment[];
     console.log("santhusan",bookedAppointments)
      const bookedSlots = bookedAppointments.map(a => a.timeSlot);

      // Filter only available ones
      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

      res.json({ allSlots, bookedSlots, availableSlots });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
}

export const { createSlot, getSlots, getdoctoravailability } = availabilityController;
export default availabilityController;
