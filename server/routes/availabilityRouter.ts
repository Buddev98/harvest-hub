import { Router } from "express";
import { createSlot, getdoctoravailability, getSlots } from "../controllers/availabilityController";
import authMiddleware from "../middleware/authMiddleware";

const availabilityRouter = Router();

availabilityRouter.use(authMiddleware);

availabilityRouter.route('/slots/create').post(createSlot);
availabilityRouter.route('/slots').get(getSlots);
availabilityRouter.route("/available-slots/:doctorId/:date").get(getdoctoravailability);


export default availabilityRouter;