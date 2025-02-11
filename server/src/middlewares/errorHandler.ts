
import { Request, Response, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errors';
import logger from '../configs/logger';

export const errorHandler: ErrorRequestHandler = (
    error: Error | AppError,
    _req: Request,
    res: Response,
): void => {

    logger.error(`${error.message} - ${error.stack}`);

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
        return;
    }

    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
    return
};