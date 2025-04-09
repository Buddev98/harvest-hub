import { Router } from "express";
import { deleteUser, getUserDetails, updateUser } from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.route('/users').get(getUserDetails).patch(updateUser).delete(deleteUser);

export default userRouter;