import { RawMaterialType } from '@prisma/client';

export interface RawMaterialDto {
    id: number;
    name: string;
    stock: number;
    type: RawMaterialType;
    createdAt: Date;
    updatedAt: Date;
}
