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

    async create(data: CreateRecipeDto) {
        return this.prisma.$transaction(async (tx) => {
            if (
                await tx.recipe.findUniqueOrThrow({
                    where: { name: data.name },
                })
            )
                throw new HttpError(409, 'Recipe already exists');

            const recipe = await tx.recipe.create({
                data: {
                    name: data.name,
                    description: data.description,
                    quantity: data.quantity,
                },
            });

            await Promise.all(
                data.materials.map(async (materialOnRecipe) => {
                    const material = await tx.rawMaterial.findUniqueOrThrow({
                        where: { id: materialOnRecipe.id },
                    });

                    if (!material)
                        throw new HttpError(404, 'Raw material not found');

                    return tx.rawMaterialOnRecipe.create({
                        data: {
                            ...data,
                            rawMaterial: {
                                connect: {
                                    id: material.id,
                                },
                            },
                            recipe: {
                                connect: {
                                    id: recipe.id,
                                },
                            },
                        },
                    });
                })
            );

            return recipe;
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
