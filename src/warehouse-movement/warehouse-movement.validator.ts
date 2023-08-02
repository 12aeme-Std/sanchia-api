import Joi from 'joi';

export const CreateWarehouseMovementSchema = Joi.object({
    userId: Joi.number().required(),
    type: Joi.string().required(),
    quantity: Joi.number().required(),

    warehouseOriginId: Joi.number().required(),

    warehouseDestinationId: Joi.number().optional(),
    mixMachineId: Joi.number().optional(),
    manufactureMachineId: Joi.number().optional(),

    rawMaterialId: Joi.number().required(),
});
