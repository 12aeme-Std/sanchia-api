import { Prisma, PrismaClient } from '@prisma/client';
import { ProductDto } from './dtos/product.dto';
import { HttpError } from '../common/http-error';
import { IPagination } from '../common/interfaces/pagination.interface';

export class ProductService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // TODO: Are we handling unique products?
    // TODO: Are we sure we want to save img in disk?
    // TODO: All products are related with a category?
    async createProdut(data: Prisma.ProductCreateInput): Promise<ProductDto> {
        return await this.prisma.product.create({ data });
    }

    // TODO: If img and category are requiretments, include them in query
    async findOne(where: Prisma.ProductWhereUniqueInput): Promise<ProductDto> {
        return await this.prisma.product
            .findUniqueOrThrow({ where })
            .catch(() => {
                throw new HttpError(404, 'Product not found');
            });
    }

    // TODO: If img and category are requiretments, include them in query
    async findAll(
        params: IPagination & {
            cursor?: Prisma.ProductWhereUniqueInput;
            where?: Prisma.ProductWhereInput;
            orderBy?: Prisma.ProductOrderByWithAggregationInput;
        }
    ): Promise<ProductDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return await this.prisma.product.findMany({
            skip: page! - 1,
            take: limit,
            cursor,
            where,
            orderBy,
        });
    }

    // TODO: Check if in this EP the image and the category associeted with this product can be changed
    async update(
        id: number,
        data: Prisma.ProductUpdateInput
    ): Promise<ProductDto> {
        await this.findOne({ id });

        return await this.prisma.product.update({ data, where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.findOne({ id });

        await this.prisma.product.delete({ where: { id } });
    }
}
