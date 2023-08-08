import Joi from 'joi';

export const CreateManufactureMachineSchema = Joi.object({
    name: Joi.string().required(),
});

export const UpdateManufactureMachineSchema = Joi.object({
    name: Joi.string().required(),
});
