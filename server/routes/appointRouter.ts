import { Router } from "express";
import { getPatientAppointments ,updateStatus,cancelAppointment,getMyAppointments, getappointment } from "../controllers/appointController";
import authMiddleware from "../middleware/authMiddleware";

const appointRouter = Router();

// Apply authMiddleware to all routes in this router
appointRouter.use(authMiddleware);
console.log("coming inside appoint router")
appointRouter.route('/getappointlist').get(getPatientAppointments)
appointRouter.route('/appointments/approve/:id').patch(updateStatus)
appointRouter.route('/appointment/cancel/:id').patch(cancelAppointment)
appointRouter.route('/myappointment').get(getMyAppointments)
appointRouter.route("/appointments").post(getappointment)


export default appointRouter;