import { Request, Response, NextFunction } from 'express';

export interface AuthorizeOptions {
    allowedGroup: string[];
}

export function authorize(options: AuthorizeOptions) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { role } = req.user;

        if (!options.allowedGroup.includes(role))
            return res.status(403).json({ message: 'Forbidden' });

        next();
    };
}
