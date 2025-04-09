import { authMiddleware } from './../middleware/authMiddleware';
import { Router } from "express";
import { register, login, logout, refreshToken } from "../controllers/authController";
import rateLimit from 'express-rate-limit';

const authRouter = Router();

// Define the rate limiter for the refreshToken endpoint
const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});


authRouter.route('/register').post(register);
authRouter.route('/login').post(login);
authRouter.route('/logout').post(logout);
authRouter.route('/refresh-token').post(refreshTokenLimiter, authMiddleware, refreshToken);

export default authRouter;