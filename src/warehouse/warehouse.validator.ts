import { WarehoseType } from '@prisma/client';
import Joi from 'joi';

export const CreateWarehouseSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string()
        .valid(...Object.values(WarehoseType))
        .required(),
});

export const UpdateWarehouseSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    type: Joi.string()
        .valid(...Object.values(WarehoseType))
        .optional(),
});
