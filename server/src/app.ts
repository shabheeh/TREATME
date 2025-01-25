
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config()
import connectDB from './configs/db';
import logger from './configs/logger';
import sessionConfig from './configs/sessionConfig';
import patientRouter from "./routes/patient/patientRouter";
import adminRouter from "./routes/admin/adminRouter";
import doctorRouter from './routes/doctor/doctorRouter'
import sharedRouter from './routes/shared/sharedRouter'
import { errorHandler } from './middlewares/errorHandler';

const app = express();


const corsOptions = { 
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  
  };

//Middlewares
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(helmet()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);
app.use(cookieParser()); 
 


 

//connect db
connectDB(); 


//routes
app.use('/api/patient', patientRouter)
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/shared', sharedRouter)

 

app.use(errorHandler)

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);

});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception thrown:', error);

});


const PORT: string | undefined = process.env.PORT;

if(!PORT) {
    throw new Error('PORT is not defined in env')
}

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
}) 