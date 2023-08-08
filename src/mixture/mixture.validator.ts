import Joi from 'joi';
import { CreateMixtureDto } from './dtos/create-mixture.dto';
import { CreateMixtureResultDto } from './dtos/create-result.dto';

export const CreateMixtureSchema = Joi.object<CreateMixtureDto>({
    name: Joi.string().required(),

    mixtureMachineId: Joi.number().required(),
    recipeId: Joi.number().required(),

    materials: Joi.object({
        rawMaterialId: Joi.number().required(),
        quantity: Joi.number().required(),
    }),
});

export const UpdateMixtureSchema = Joi.object<CreateMixtureDto>({
    name: Joi.string().optional(),

    mixtureMachineId: Joi.number().optional(),
    recipeId: Joi.number().optional(),

    materials: Joi.object({
        rawMaterialId: Joi.number().optional(),
        quantity: Joi.number().optional(),
    }),
});

export const CreateMixtureResultSchema = Joi.object<CreateMixtureResultDto>({
    mixtureId: Joi.number().required(),
    quantity: Joi.number().required(),
    finishedAt: Joi.date().required(),
});
