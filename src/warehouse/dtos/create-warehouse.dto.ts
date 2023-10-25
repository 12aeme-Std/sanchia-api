import { WarehoseType } from '@prisma/client';

export interface CreateWarehouseDto {
    name: string;
    description: string;
    type: WarehoseType;
}
