import { Prisma, PrismaClient } from '@prisma/client';
import { RecipeDto } from './dtos/recipe.dto';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';

export class RecipeService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: Prisma.RecipeCreateInput): Promise<RecipeDto> {
        if (!this.exists({ name: data.name }))
            throw new HttpError(409, 'Recipe already exists');

        return await this.prisma.recipe.create({ data });
    }

    async findOne(where: Prisma.RecipeWhereUniqueInput): Promise<RecipeDto> {
        return await this.prisma.recipe
            .findUniqueOrThrow({ where })
            .catch(() => {
                throw new HttpError(404, 'Recipe not found');
            });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.RecipeWhereUniqueInput;
            where?: Prisma.RecipeWhereInput;
            orderBy?: Prisma.RecipeOrderByWithAggregationInput;
        }
    ): Promise<RecipeDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return await this.prisma.recipe.findMany({
            take: page! - 1,
            skip: limit,
            where,
            orderBy,
            cursor,
        });
    }

    async update(
        id: number,
        data: Prisma.RecipeUpdateInput
    ): Promise<RecipeDto> {
        if (!this.exists({ id })) {
            throw new HttpError(409, 'Recipe already exists');
        }

        return await this.prisma.recipe.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        if (!this.exists({ id })) {
            throw new HttpError(409, 'Recipe already exists');
        }

        await this.prisma.recipe.delete({ where: { id } });
    }

    private async exists(where: Prisma.RecipeWhereUniqueInput) {
        return (await this.prisma.recipe.findUnique({ where })) !== null;
    }
}
