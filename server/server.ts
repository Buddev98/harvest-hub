import express, { Express, json } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routes/userRouter';
import authRouter from './routes/authRouter';
import availabilityRouter from './routes/availabilityRouter';
import logger from './logger';

import appointRouter from './routes/appointRouter';
import medicalRecord from './routes/medicalRecord';

dotenv.config();

const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use(json());
app.use(cookieParser());

const db: string = process.env.MONGO_URI || 'mongodb://localhost:27017/appointment_management';
mongoose.connect(db).then(() => console.log('MongoDB connected')).catch((err) => console.log(err));
logger.info('MongoDB connected successfully');
// Routes
app.use(authRouter);
app.use(userRouter);
app.use(availabilityRouter);
app.use(appointRouter);
app.use(medicalRecord);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));