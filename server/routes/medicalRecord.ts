import { Router } from "express";
import { register, login, logout } from "../controllers/authController";
import { postmedicalrecord } from "../controllers/medicalRecord";

const medicalRecord = Router();

medicalRecord.route('/medical-records').post(postmedicalrecord);

export default medicalRecord;