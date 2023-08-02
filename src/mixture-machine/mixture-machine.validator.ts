import Joi from 'joi';

export const CreateMixtureMachineSchema = Joi.object({
    name: Joi.string().required(),
});

export const UpdateMixtureMachineSchema = Joi.object({
    name: Joi.string().required(),
});
