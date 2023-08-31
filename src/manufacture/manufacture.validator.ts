import Joi from 'joi';
import { CreateManufactureDto } from './dtos/create-manufacture.dto';

export const createManufactureSchema = Joi.object<CreateManufactureDto>({
    name: Joi.string().required(),
    manufactureMachineId: Joi.number().required(),

    resources: Joi.array().items({
        mixtureResultId: Joi.number().optional(),
        rawMaterialId: Joi.number().optional(),
        quantity: Joi.number().required(),
    }),
});
