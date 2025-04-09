import { Request, Response } from "express";
import mongoose from 'mongoose';
import Appointment from "../models/AppointModel";
import logger from '../logger';
import { JwtPayload } from 'jsonwebtoken';

const appointController = {
  //getting appointments lists from doctor portal
  getPatientAppointments: async (req: Request, res: Response) => {

    console.log("inside controller")
    try {
      const { status } = req.query;

      const appointments = await Appointment.find(status ? { status } : {});
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }


  },

   //updating appointments approval status from doctor portal
  updateStatus: async (req: Request, res: Response) => {

    const { id } = req.params;

    try {
      console.log("inside controller update status")
      const appointment = await Appointment.findByIdAndUpdate(
        id,
        { status: 'confirmed' },
        { new: true }
      );

      if (!appointment) {
        res.status(404).json({ error: 'Appointment not found' });
        return
      }

      res.status(200).json(appointment);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },


  // cancelling the appointment from patient portal
  cancelAppointment: async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("inside cancel appointment new");
    try {
      // Find the appointment to be canceled
      const appointmentToCancel = await Appointment.findById(id);
  
      if (!appointmentToCancel) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }
  
      // Check if the appointment status is "waitlisted"
      if (appointmentToCancel.status === 'waitlisted') {
        // Update the status of the appointment to "canceled"
        appointmentToCancel.status = 'canceled';
        await appointmentToCancel.save();
        console.log("cancel status updated", appointmentToCancel.status, appointmentToCancel._id);
  
        res.status(200).json({ message: 'Appointment canceled', statusCode: "110", appointmentToCancel });
        return;
      }
  
      // Update the status of the appointment to "canceled"
      appointmentToCancel.status = 'canceled';
      await appointmentToCancel.save();
      console.log("cancel status updated", appointmentToCancel.status, appointmentToCancel._id);
  
      // Find the first waitlisted appointment with the same date and timeSlot
      const waitlistedAppointment = await Appointment.findOne({
        date: appointmentToCancel.date,
        timeSlot: appointmentToCancel.timeSlot,
        status: 'waitlisted'
      }).sort({ createdAt: 1 });
  
      if (!waitlistedAppointment) {
        res.status(200).json({ message: 'Appointment canceled and there are no waitlisted patients to update', statusCode: "120", appointmentToCancel });
        return;
      }
  
      // Update the status of the waitlisted appointment to "confirmed"
      waitlistedAppointment.status = 'confirmed';
      await waitlistedAppointment.save();
      console.log("next person status updated", waitlistedAppointment.status, waitlistedAppointment._id);
  
      res.status(200).json({ message: 'Appointment canceled and next waitlisted appointment confirmed', statusCode: "150", appointmentToCancel, waitlistedAppointment });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  

  //getting the patient details for cancelling the appointment from patient portal

  getMyAppointments: async (req: Request, res: Response) => {

    const usercheck = req.user as JwtPayload;
    const patientId:string = usercheck.id;

    console.log("inside my appointments loop userid is",patientId)
    try {
      // const { id } = req.params;
      // console.log("id is", id)

      const myAppointments = await Appointment.find({ patientId: new mongoose.Types.ObjectId(patientId) });
      console.log("my appointment ", myAppointments)
      if (!myAppointments) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }

      res.status(200).json(myAppointments);                                   
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }


  },
  getappointment:  async (req:Request, res:Response) => {
      // try {
      //   const { doctorId, date, timeSlot } = req.body;
      //   const usercheck = req.user as JwtPayload;
      //  const patientId = usercheck.id;
      //   const formattedDate = date;
     
      //   // Check if the selected slot is still available
      //   const availability = await availabilityModel.findOne({ doctorId });
     
      //   if (!availability) {
      //      res.status(404).json({ message: 'Doctor has no available slots' });
      //      return
      //   }
     
      //   let dateEntry = availability.availableSlots.find(
      //     (d) => d.date && d.date === formattedDate
      //   );
     
      //   if (!dateEntry || !dateEntry.timeSlots.includes(timeSlot)) {
      //      res.status(400).json({ message: 'Selected slot is no longer available' });
      //      return
      //   } 
     
      //   // Remove the booked slot from available slots
      //   // dateEntry.timeSlots = dateEntry.timeSlots.filter((slot) => slot !== timeSlot);
      //   // await availability.save();
     
      //   // Create the appointment
      //   const appointment = new Appointment({
      //     doctorId,
      //     patientId,
      //     date,
      //     timeSlot,
      //     status: "confirmed"
      //   });
     
      //   await appointment.save();
     
      //   res.status(201).json({ message: 'Appointment booked successfully' });
      // } 
      try {
        const { doctorId, date, timeSlot } = req.body;
        const formattedDate = date;
        const usercheck = req.user as JwtPayload;
       const patientId = usercheck.id;
       const existingPatientAppointment = await Appointment.findOne({
        doctorId,
        date,
        timeSlot,
        patientId,
        status: 'confirmed',
      });
    
      if (existingPatientAppointment) {
         res.status(200).json({ message: 'You already have a confirmed appointment for this slot.' });
         return;
      }
        const existing = await Appointment.findOne({
          doctorId,
          date,
          timeSlot,
          status: 'confirmed',
        });
     console.log(existing,"santhusan")
        const status = existing ? 'waitlisted' : 'confirmed';
     
        const appointment = new Appointment({
          doctorId,
          patientId,
          date,
          timeSlot,
          status,
        });
     
        await appointment.save();
     
        res.status(201).json({ message: `Appointment ${status}`, status });
      }
      catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
    }
};

export const { getPatientAppointments, updateStatus, cancelAppointment, getMyAppointments,getappointment } = appointController;
export default appointController;




