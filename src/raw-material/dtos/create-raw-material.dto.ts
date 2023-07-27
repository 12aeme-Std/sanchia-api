import { Prisma } from '@prisma/client';

export type CreateRawMaterialDto = {
    warehouse: number;
} & Omit<Prisma.RawMaterialCreateInput, 'warehouse'>;
