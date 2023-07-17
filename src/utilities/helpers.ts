import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const encrypt = async (text: string) => {
    const hash = await bcrypt.hash(text, 10);
    return hash;
};

export const compare = async (pass: string, hash: string) => {
    return await bcrypt.compare(pass, hash);
};

export const tokenKey = async (userId: any) => {
    const token = jwt.sign({ id: userId }, String(process.env.JWT_KEY), {
        expiresIn: '5d',
    });
    return String(token);
};
