import { WarehouseType } from '@prisma/client';

export interface CreateMovementDto {
    userId: number;
    registeredAt?: Date | string;
    type: WarehouseType;
    quantity: number;

    warehouseOriginId: number;

    warehouseDestinationId?: number;
    mixMachineId?: number;
    manufactureMachineId?: number;

    rawMaterialId: number;
}
