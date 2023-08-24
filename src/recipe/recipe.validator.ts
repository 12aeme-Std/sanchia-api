import Joi from 'joi';

export const CreateRecipeSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().required(),
    quantity: Joi.number().required(),
    materials: Joi.array().items({
        id: Joi.number().required(),
        quantity: Joi.number().required(),
    }),
});

export const UpdateRecipeSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    quantity: Joi.number().optional(),
    materials: Joi.array().items({
        id: Joi.number().optional(),
        quantity: Joi.number().optional(),
    }),
});
