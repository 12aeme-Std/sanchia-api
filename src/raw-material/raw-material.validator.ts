import Joi from 'joi';

export const CreateRawMaterialSchema = Joi.object({
    name: Joi.string().required(),
    stock: Joi.number().required(),
    type: Joi.string().required(),
    warehouse: Joi.number().required(),
});

export const UpdateRawMaterialSchema = Joi.object({
    name: Joi.string().optional(),
    stock: Joi.number().optional(),
    type: Joi.string().optional(),
    warehouse: Joi.number().optional(),
});
