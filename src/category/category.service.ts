import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { Prisma, PrismaClient } from '@prisma/client';
import { CategoryDto } from './dtos/category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

// TODO: Check what roles can handle categories
export class CategoryService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: CreateCategoryDto): Promise<CategoryDto> {
        if (await this.exists({ name: data.name }))
            throw new HttpError(409, 'Category already exists');

        return this.prisma.category.create({ data });
    }

    // TODO: Do we have to include products related with each category?
    async findOne(
        where: Prisma.CategoryWhereUniqueInput
    ): Promise<CategoryDto | null> {
        return this.prisma.category.findUniqueOrThrow({ where }).catch(() => {
            throw new HttpError(404, 'Category not found');
        });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.CategoryWhereUniqueInput;
            where?: Prisma.CategoryWhereInput;
            orderBy?: Prisma.CategoryOrderByWithAggregationInput;
        }
    ): Promise<CategoryDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return this.prisma.category.findMany({
            skip: limit! * (page! - 1),
            take: limit,
            cursor,
            orderBy,
            where,
        });
    }

    async update(id: number, data: UpdateCategoryDto): Promise<CategoryDto> {
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Category does not exists');

        const category = await this.prisma.category.findUnique({
            where: { name: data.name },
        });

        if (category?.name === data.name)
            throw new HttpError(409, `Category ${data.name} already exists`);

        return this.prisma.category.update({ data, where: { id } });
    }

    async delete(id: number): Promise<void> {
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Category does not exists');

        await this.prisma.category.delete({ where: { id } });
    }

    private async exists(where: Prisma.CategoryWhereUniqueInput) {
        return (await this.prisma.category.findUnique({ where })) !== null;
    }
}
