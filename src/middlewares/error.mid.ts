import { HttpError } from '@common/http-error';
import { NextFunction, Request, Response } from 'express';

export default function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof HttpError)
        return res.status(err.getStatusCode()).json({ message: err.message });

    // TODO: On prod, change this return message
    if (err) return res.status(400).json({ message: err.message });

    next();
}
