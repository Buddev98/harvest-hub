import { Router } from "express";
import { register, login } from "../controllers/authController";
import { getappointment } from "../controllers/appointController"

const appointment = Router();
appointment.route("/appointments").post(getappointment);

export default appointment;