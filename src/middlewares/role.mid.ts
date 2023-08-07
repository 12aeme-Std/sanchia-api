import { Request, Response, NextFunction } from 'express';

export interface AuthorizeOptions {
    allowedGroup: string[];
}

// Define the 'authorize' middleware function
export function authorize(options: AuthorizeOptions) {
    return (req: Request, res: Response, next: NextFunction) => {
        // Extract the role from the user object in the request
        const { role } = req.user;

        // Check if the user's role is included in the allowed roles/groups
        if (!options.allowedGroup.includes(role)) {
            // If not allowed, send a 403 Forbidden status code in the response
            return res.status(403).json({ message: 'Forbidden' });
        }

        // If the user's role is allowed, proceed to the next middleware or route handler
        next();
    };
}
