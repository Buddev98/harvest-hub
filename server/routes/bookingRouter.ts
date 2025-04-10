import { Router } from "express";
import {  getMyBookings,addBooking,getproduct } from "../controllers/bookingController";
import authMiddleware from "../middleware/authMiddleware";
 
const bookingRouter = Router();
 
// Apply authMiddleware to all routes in this router
bookingRouter.use(authMiddleware);
console.log("coming inside booking  router")
 
bookingRouter.route('/mybookings').get(getMyBookings);
bookingRouter.route('/book').post(addBooking);
 
bookingRouter.route('/product').get(getproduct)
export default bookingRouter;