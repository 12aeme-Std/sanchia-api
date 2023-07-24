import { Prisma } from '@prisma/client';

export type CreateProductDto = Omit<Prisma.ProductCreateInput, 'category'> & {
    category: string;
};
