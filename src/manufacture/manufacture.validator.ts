import Joi from 'joi';
import { CreateManufactureDto } from './dtos/create-manufacture.dto';
import { CreateManufactureResultDto } from './dtos/create-result.dto';

export const createManufactureSchema = Joi.object<CreateManufactureDto>({
    name: Joi.string().required(),
    manufactureMachineId: Joi.number().required(),

    resources: Joi.array().items({
        mixtureResultId: Joi.number().optional(),
        rawMaterialId: Joi.number().optional(),
        quantity: Joi.number().required(),
    }),
});

export const createResultSchema = Joi.object<CreateManufactureResultDto>({
    manufactureId: Joi.number().required(),
    quantity: Joi.number().required(),
    finishedAt: Joi.date().required(),
    waste: Joi.string().optional(),
    wasteQuantity: Joi.number().optional(),
    productResultName: Joi.string().required(),
    productResultQuantity: Joi.number().required(),
    burr: Joi.string().optional(),
    burrQuantity: Joi.number().optional(),
});
