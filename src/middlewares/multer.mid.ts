import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { NextFunction, Request, Response } from 'express';

const s3Config: S3ClientConfig = {
    endpoint: process.env.S3_ENDPOINT as string,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
};

const s3Client = new S3Client(s3Config);

const uploadMulter = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: String(process.env.BUCKET_NAME),
        acl: 'public-read',
        metadata: (req: Request, file: Express.Multer.File, cb) => {
            cb(null, {
                fieldname: file.fieldname,
            });
        },
        key: (req: Request, file: Express.Multer.File, cb) => {
            const uniqueFileName = Date.now().toString() + file.originalname;
            cb(null, uniqueFileName);
        },
    }),
}).array('upload', 10);

const upload = (req: Request, res: Response, next: NextFunction) => {
    uploadMulter(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error uploading files' });
        }
        next();
    });
};

export default upload;
