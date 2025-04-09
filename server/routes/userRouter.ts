import { Router } from "express";
import { deleteUser, getpatients, getUsers, updateUser } from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.route('/users').get(getUsers);
userRouter.route('/users/:id').put(updateUser).patch(updateUser).delete(deleteUser);
userRouter.route('/getpatients').get(getpatients);

export default userRouter;