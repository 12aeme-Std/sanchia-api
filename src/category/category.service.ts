import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { Prisma, PrismaClient } from '@prisma/client';
import { CategoryDto } from './dtos/category.dto';

// TODO: Check what roles can handle categories
export class CategoryService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // TODO: Do we have unique categories?
    async create(data: Prisma.CategoryCreateInput): Promise<CategoryDto> {
        return await this.prisma.category.create({ data });
    }

    // TODO: Do we have to include products related with each category?
    async findOne(
        where: Prisma.CategoryWhereUniqueInput
    ): Promise<CategoryDto | null> {
        return await this.prisma.category
            .findUniqueOrThrow({ where })
            .catch(() => {
                throw new HttpError(404, 'Category not found');
            });
    }

    // TODO: Do we have to include products related with each category?
    async findAll(
        params: IPagination & {
            cursor?: Prisma.CategoryWhereUniqueInput;
            where?: Prisma.CategoryWhereInput;
            orderBy?: Prisma.CategoryOrderByWithAggregationInput;
        }
    ): Promise<CategoryDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return await this.prisma.category.findMany({
            skip: page! - 1,
            take: limit,
            cursor,
            orderBy,
            where,
        });
    }

    async update(
        id: number,
        data: Prisma.CategoryUpdateInput
    ): Promise<CategoryDto> {
        await this.findOne({ id });

        return await this.prisma.category.update({ data, where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.findOne({ id });

        await this.prisma.category.delete({ where: { id } });
    }
}
