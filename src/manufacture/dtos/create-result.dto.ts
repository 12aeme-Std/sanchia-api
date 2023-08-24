import { ManufactureProductType } from '@prisma/client';

export interface CreateManufactureResultDto {
    finishedAt: Date | string;
    waste: number;
    burr: number;
    warehouseId?: number;
}

export interface CreateManufactureProductDto {
    name: string;
    type: ManufactureProductType;
    recipeId: number;
}

export interface FinishManufactureProcessDto {
    manufactureId: number;
    result: CreateManufactureResultDto;
    product: CreateManufactureProductDto;
}
