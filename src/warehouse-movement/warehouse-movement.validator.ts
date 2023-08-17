import Joi from 'joi';

export const CreateWarehouseMovementSchema = Joi.object({
    type: Joi.string().required(),
    quantity: Joi.number().required(),

    warehouseOriginId: Joi.number().optional(),

    warehouseDestinationId: Joi.number().optional(),
    mixMachineId: Joi.number().optional(),
    manufactureMachineId: Joi.number().optional(),
    manufactureResultId: Joi.number().optional(),

    rawMaterialId: Joi.number().optional(),
});
