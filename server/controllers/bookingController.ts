import { Request, Response } from "express";
import Product from "../models/ProductModel";

import Booking from '../models/BookingModel';
import mongoose from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
const bookingController = {

    getproduct: async (req: Request, res: Response) => {


        try {




            const produce = await Product.find();
            res.json(produce);
        } catch (error) {
            res.status(500).json({ error: 'record not found' });
        }
    },

    getMyBookings: async (req: Request, res: Response) => {

        const usercheck = req.user as JwtPayload;
        const reqUserid: string = usercheck.id;
        console.log("inside get booking")
        console.log("inside get booking user id", reqUserid)

        try {
            const bookings = await Booking.find({ buyerId: reqUserid })
            console.log(" booking list", bookings)
            
            res.status(200).json(bookings);
        } catch (error) {
            console.log('Error populating productId:', (error as Error).message);
            res.status(500).json({ error: 'Server error' });
        }

    },

    addBooking: async (req: Request, res: Response) => {
        const usercheck = req.user as JwtPayload;
        const reqUserid: string = usercheck.id;
        const { productId, quantityBooked } = req.body;
        if (!reqUserid || !productId || !quantityBooked) {
            res.status(400).json({ error: 'All fields are required' });
            return
        }
        try {
            const newBooking = new Booking({
                buyerId: reqUserid,
                productId,
                quantityBooked,
                bookingDate: new Date().toISOString().split("T")[0],
                status: 'booked'
            });

            const createdBooking = await newBooking.save();

            const update=await Product.findById(productId)
            if(update){
                const count=update?.quantity - quantityBooked;
                console.log("update quantity",update?.quantity, "count value is",count)
                update.quantity=count;
                update.save();

            }
           
            res.status(201).json(createdBooking);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }

    }






};


export const { getproduct, addBooking, getMyBookings } = bookingController;
export default bookingController;



