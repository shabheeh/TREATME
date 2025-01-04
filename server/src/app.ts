
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config()
import connectDB from './configs/db';
import logger from './configs/logger';
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import sessionConfig from './configs/sessionConfig.';
import passport from 'passport';
import './configs/passport'

const app = express();


//Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);

app.use(passport.initialize());
app.use(passport.session())

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
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
app.use('/api/users', userRouter)
app.use('/auth', authRouter)
const PORT: string | undefined = process.env.PORT;

if(!PORT) {
    throw new Error('PORT is not defined in env')
}

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
}) 