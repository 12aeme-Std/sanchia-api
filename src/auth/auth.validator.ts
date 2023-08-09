import Joi from 'joi';
import { LoginDto } from './dtos/login.dto';

export const loginSchema = Joi.object<LoginDto>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
