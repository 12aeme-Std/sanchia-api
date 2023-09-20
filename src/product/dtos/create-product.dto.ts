import { Prisma } from '@prisma/client';
import { ProductDimentionsDto } from './product-dimentions.dto';

export type CreateProductDto = Omit<Prisma.ProductCreateInput, 'category'> & {
    category: string;
    productDimentions: ProductDimentionsDto;
};
