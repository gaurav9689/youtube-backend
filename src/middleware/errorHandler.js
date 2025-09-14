import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/AppError.js';


export const notFound = (req, res, next) => {
next(new AppError(StatusCodes.NOT_FOUND, `Route not found: ${req.originalUrl}`));
};


export const errorHandler = (err, req, res, next) => {
const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
const payload = {
success: false,
message: err.message || 'Something went wrong',
};
if (err.details) payload.details = err.details;
if (process.env.NODE_ENV !== 'production' && err.stack) payload.stack = err.stack;
res.status(status).json(payload);
};