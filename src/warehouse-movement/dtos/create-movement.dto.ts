import { WarehouseMovementType } from '@prisma/client';

export interface CreateMovementDto {
    userId: number;
    registeredAt?: Date | string;
    type: WarehouseMovementType;
    quantity: number;

    warehouseOriginId: number;

    warehouseDestinationId?: number;
    mixMachineId?: number;
    manufactureMachineId?: number;

    rawMaterialId?: number;
    manufactureResultId: number;
    mixtureResultId: number;
}
