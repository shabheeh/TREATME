
import express, { Request, Response, NextFunction} from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config()
import connectDB from './configs/db';
import logger from './configs/logger';
import sessionConfig from './configs/sessionConfig';
import userRouter from "./routes/user/userRouter";
import adminRouter from "./routes/admin/adminRouter";

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
 

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

process.on('unhandledRejection', (err: Error) => {
    logger.error('Unhandled Rejection:', err);
    process.exit(1);
});
 

//connect db
connectDB(); 


//routes
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)

const PORT: string | undefined = process.env.PORT;

if(!PORT) {
    throw new Error('PORT is not defined in env')
}

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
}) 