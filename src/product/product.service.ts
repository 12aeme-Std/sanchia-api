import { Prisma, PrismaClient } from '@prisma/client';
import { ProductDto } from './dtos/product.dto';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CategoryService } from '@category/category.service';
import { CreateProductDto } from './dtos/create-product.dto';
// import { CategoryDto } from '@category/dtos/category.dto';

export class ProductService {
    private readonly prisma: PrismaClient;
    private readonly categoryService: CategoryService;

    constructor() {
        this.prisma = new PrismaClient();
        this.categoryService = new CategoryService();
    }

    // TODO: Product img
    async createProdut(data: CreateProductDto): Promise<ProductDto> {
        if (!(await this.categoryService.findOne({ name: data.category }))) {
            throw new HttpError(400, 'Invalid category');
        }

        if (
            await this.prisma.product.findUnique({ where: { name: data.name } })
        )
            throw new HttpError(409, 'Product already exists');

        return this.prisma.product.create({
            data: {
                ...data,
                category: {
                    connect: {
                        name: data.category,
                    },
                },
            },
        });
    }

    // TODO: If img and category are requiretments, include them in query
    async findOne(where: Prisma.ProductWhereUniqueInput): Promise<ProductDto> {
        return this.prisma.product.findUniqueOrThrow({ where }).catch(() => {
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

        // TODO: Include all the category and not just the id

        return this.prisma.product.findMany({
            skip: limit! * (page! - 1),
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

        // TODO: Add method to verify that the new name does not exists

        return this.prisma.product.update({ data, where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.findOne({ id });

        await this.prisma.product.delete({ where: { id } });
    }
}
