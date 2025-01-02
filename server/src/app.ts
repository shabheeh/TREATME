
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config()
import connectDB from './configs/db';
import logger from './configs/logger';

const app = express();


//Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
 

//connect db
connectDB();

const PORT: string | undefined = process.env.PORT;

if(!PORT) {
    throw new Error('PORT is not defined in env')
}

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
}) 