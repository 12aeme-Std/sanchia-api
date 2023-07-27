import { Prisma, PrismaClient } from '@prisma/client';
import { RecipeDto } from './dtos/recipe.dto';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CreateRecipeDto } from './dtos/create-recipe.dto';

export class RecipeService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // TODO: Fix error when material does not exists
    async create(data: CreateRecipeDto) {
        if (await this.exists({ name: data.name }))
            throw new HttpError(409, 'Recipe already exists');

        const recipe = await this.prisma.recipe.create({
            data: {
                ...data,
                materials: undefined,
            },
        });

        await Promise.all(
            data.materials.map((material) =>
                this.prisma.rawMaterialOnRecipe.create({
                    data: {
                        recipeId: recipe.id,
                        rawMaterialId: material.materialId,
                        quantity: material.quantity,
                    },
                })
            )
        );

        return this.prisma.recipe.findUnique({
            where: { id: recipe.id },
            include: {
                materials: true,
            },
        });
    }

    async findOne(where: Prisma.RecipeWhereUniqueInput): Promise<RecipeDto> {
        return this.prisma.recipe.findUniqueOrThrow({ where }).catch(() => {
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

        return this.prisma.recipe.findMany({
            take: limit,
            skip: limit! * (page! - 1),
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

        return this.prisma.recipe.update({
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
