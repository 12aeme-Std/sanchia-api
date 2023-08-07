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
        // Create a new recipe and associate it with provided raw materials
        return this.prisma.$transaction(async (tx) => {
            const recipeExists = await tx.recipe.findUnique({
                where: { name: data.name },
            });

            if (recipeExists) {
                throw new HttpError(409, 'Recipe already exists');
            }

            const recipe = await tx.recipe.create({
                data: {
                    name: data.name,
                    description: data.description,
                    quantity: data.quantity,
                },
            });

            // Associate raw materials with the created recipe
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

            // Return detailed information about the created recipe
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
        // Find and return a specific recipe based on the provided unique identifier
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

        // Find and return multiple recipes based on pagination and filtering parameters
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
        // Check if the recipe with the provided ID exists
        if (!this.exists({ id })) {
            throw new HttpError(409, 'Recipe does not exist');
        }

        // Update the recipe and return the updated data
        return this.prisma.recipe.update({
            data,
            where: { id },
        });
    }

    // TODO: Check how to delete this
    async delete(id: number): Promise<void> {
        if (!(await this.exists({ id }))) {
            throw new HttpError(409, 'Recipe does not exist');
        }

        // Delete the recipe from the database
        await this.prisma.recipe.delete({ where: { id } });
    }

    // Private method to check if a recipe exists based on the provided query
    private async exists(where: Prisma.RecipeWhereUniqueInput) {
        return (await this.prisma.recipe.findUnique({ where })) !== null;
    }
}
