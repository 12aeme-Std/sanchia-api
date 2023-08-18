import { WarehouseMovementType } from '@prisma/client';
import Joi from 'joi';

export const CreateWarehouseMovementSchema = Joi.object({
    quantity: Joi.number().required(),
    type: Joi.string()
        .valid(...Object.values(WarehouseMovementType))
        .required(),

    warehouseOriginId: Joi.number().optional(),

    warehouseDestinationId: Joi.number().optional(),
    mixMachineId: Joi.number().optional(),
    manufactureMachineId: Joi.number().optional(),
    manufactureResultId: Joi.number().optional(),

    rawMaterialId: Joi.number().optional(),
});
