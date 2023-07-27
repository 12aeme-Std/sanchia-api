import { RawMaterials } from '@prisma/client';

export interface RawMaterialDto {
    id: number;
    name: string;
    quantity: number;
    type: RawMaterials;
    createdAt: Date;
    updatedAt: Date;
}
