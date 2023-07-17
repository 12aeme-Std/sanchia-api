import jwt from 'jsonwebtoken';
import { type Response, type NextFunction } from 'express';
import { type CustomRequest } from './models';
import roles from './roles';
import multer from 'multer';

export const verifyToken = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { authorization } = req.headers;
        const removeBearer = authorization?.split(' ') != null || '';
        const token = removeBearer[1];
        const verify: any = jwt.verify(
            String(token),
            String(process.env.JWT_KEY)
        );
        const user: any = jwt.decode(token);

        if (!verify) {
            return res.status(404).send({ message: 'Unexpected TokenAccess' });
        } else {
            req.user = { id: Number(user.id), role: String(user.role) };
            next();
        }
    } catch (err) {
        return res.status(500).send({
            message: 'ups, server error',
            err,
        });
    }
};

export const verifyRole = (action: string, resource: any) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
        if (!req.user?.role) {
            return res.status(404).send({ message: 'Unexpected role' });
        }

        const permission: any = roles.grant(req.user?.role);
        const granted = permission[action](resource).granted;

        if (!granted) {
            return res.status(404).send({ message: 'Missing access' });
        } else {
            next();
        }
    };
};

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = file.originalname.split('.').pop();
        const filename = `${uniqueSuffix}.${extension}`;
        cb(null, filename);
    },
});

export const upload = multer({ storage });
