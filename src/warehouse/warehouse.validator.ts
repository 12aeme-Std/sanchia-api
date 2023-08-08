import Joi from 'joi';

export const CreateWarehouseSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
});

export const UpdateWarehouseSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
});
