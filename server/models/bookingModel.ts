import mongoose, { Document, Schema } from 'mongoose';
 
 
interface IBooking extends Document {
    buyerId: mongoose.Schema.Types.ObjectId;
    productId: mongoose.Schema.Types.ObjectId;
    quantityBooked: number;
 
    status: 'booked' | 'canceled' | 'pending';
    bookingDate: string;
 
}
 
 
const bookingSchema: Schema<IBooking> = new mongoose.Schema({
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantityBooked: Number,
    bookingDate: { type: String, required: true },
    status: {
        type: String,
        enum: ['booked', 'canceled', 'pending'],
        default: 'pending'
    },
});
 
 
const Booking = mongoose.model<IBooking>('booking', bookingSchema);
export default Booking;
 