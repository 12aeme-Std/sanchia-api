import Joi from 'joi';
import { CreateManufactureDto } from './dtos/create-manufacture.dto';
import { CreateManufactureResultDto } from './dtos/create-result.dto';

export const createManufactureSchema = Joi.object<CreateManufactureDto>({
    name: Joi.string().required(),
    manufactureMachineId: Joi.number().required(),
    resources: Joi.object({
        mixtureResultId: Joi.number().optional(),
        rawMaterialId: Joi.number().optional(),
        quantity: Joi.number().required(),
    }),
});

export const createResultSchema = Joi.object<CreateManufactureResultDto>({
    manufactureId: Joi.number().required(),
    quantity: Joi.number().required(),
    finishedAt: Joi.date().required(),
});
