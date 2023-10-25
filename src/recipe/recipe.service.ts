import { Prisma, PrismaClient } from '@prisma/client';
import { RecipeDto } from './dtos/recipe.dto';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CreateRecipeDto } from './dtos/create-recipe.dto';

export class RecipeService {
    private readonly prisma: PrismaClient;

    constructor(p?: PrismaClient) {
        this.prisma = p ?? new PrismaClient();
    }

    async create(data: CreateRecipeDto) {
        return this.prisma.$transaction(async (tx) => {
            const recipeExists = await tx.recipe.findUnique({
                where: { name: data.name },
            });

            if (recipeExists) throw new HttpError(409, 'Recipe already exists');

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

                    return tx.rawMaterialOnRecipe.create({
                        data: {
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
                            quantity: materialOnRecipe.quantity,
                        },
                    });
                })
            );

            return tx.recipe.findUniqueOrThrow({
                where: { id: recipe.id },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    quantity: true,
                    createdAt: true,
                    updatedAt: true,
                    materials: {
                        select: {
                            quantity: true,
                            rawMaterial: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
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

    // TODO: Check how to delete this
    async delete(id: number): Promise<void> {
        if (!(await this.exists({ id }))) {
            throw new HttpError(409, 'Recipe does not exists exists');
        }

        await this.prisma.recipe.delete({ where: { id } });
    }

    private async exists(where: Prisma.RecipeWhereUniqueInput) {
        return (await this.prisma.recipe.findUnique({ where })) !== null;
    }
}
