import { HttpError } from '@common/http-error';
import { NextFunction, Request, Response } from 'express';

// Define the errorHandler middleware function
export default function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Check if the error is an instance of the custom HttpError class
    if (err instanceof HttpError) {
        // If it is, send the corresponding HTTP status code and error message in the response
        return res.status(err.getStatusCode()).json({ message: err.message });
    }

    // TODO: On production, change this return message
    // If the error is not an instance of HttpError or is undefined
    // Send a generic 400 Bad Request status code and error message in the response
    if (err) return res.status(400).json({ message: err.message });

    // If none of the above conditions are met, proceed to the next middleware
    next();
}
