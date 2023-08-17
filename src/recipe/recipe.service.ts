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
            const recipeExists = await tx.recipe.findUnique({
                where: { name: data.name },
            });

            if (recipeExists) throw new HttpError(409, 'Recipe already exists');

            const recipe = await tx.recipe.create({
                data: {
                    name: data.name,
                    description: data.description,
                    quantity: data.quantity,
                    type: data.type,
                },
            });

            if (
                data.type === 'ASSEMBLY_PRODUCT' ||
                data.type === 'FINAL_PRODUCT'
            ) {
                await Promise.all(
                    data.materials.map(async (materialOnRecipe) => {
                        const mixture = await tx.mixtureResult
                            .findUniqueOrThrow({
                                where: { id: materialOnRecipe.id },
                            })
                            .catch(() => {
                                throw new HttpError(
                                    404,
                                    `Mixture ${materialOnRecipe.id} does not exists`
                                );
                            });

                        console.log('mixture', mixture);

                        return tx.resourceOnRecipe.create({
                            data: {
                                mixtureResult: {
                                    connect: {
                                        id: mixture.id,
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
            } else {
                await Promise.all(
                    data.materials.map(async (materialOnRecipe) => {
                        const material = await tx.rawMaterial
                            .findUniqueOrThrow({
                                where: { id: materialOnRecipe.id },
                            })
                            .catch(() => {
                                throw new HttpError(
                                    404,
                                    `Mixture ${materialOnRecipe.id} does not exists`
                                );
                            });

                        return tx.resourceOnRecipe.create({
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
                            },
                        });
                    })
                );
            }

            return tx.recipe.findUniqueOrThrow({
                where: { id: recipe.id },
            });
        });
    }

    async createVariant(data: CreateRecipeDto, parentId: number) {
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
                    type: data.type,
                    parentId,
                },
            });

            if (
                data.type === 'ASSEMBLY_PRODUCT' ||
                data.type === 'FINAL_PRODUCT'
            ) {
                await Promise.all(
                    data.materials.map(async (materialOnRecipe) => {
                        const mixture = await tx.mixtureResult
                            .findUniqueOrThrow({
                                where: { id: materialOnRecipe.id },
                            })
                            .catch(() => {
                                throw new HttpError(
                                    404,
                                    `Mixture ${materialOnRecipe.id} does not exists`
                                );
                            });

                        return tx.resourceOnRecipe.create({
                            data: {
                                mixtureResult: {
                                    connect: {
                                        id: mixture.id,
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
            } else {
                await Promise.all(
                    data.materials.map(async (materialOnRecipe) => {
                        const material = await tx.rawMaterial
                            .findUniqueOrThrow({
                                where: { id: materialOnRecipe.id },
                            })
                            .catch(() => {
                                throw new HttpError(
                                    404,
                                    `Mixture ${materialOnRecipe.id} does not exists`
                                );
                            });

                        return tx.resourceOnRecipe.create({
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
                            },
                        });
                    })
                );
            }

            return tx.recipe.findUniqueOrThrow({
                where: { id: recipe.id },
            });
        });
    }

    async findOne(where: Prisma.RecipeWhereUniqueInput): Promise<RecipeDto> {
        const recipe = await this.prisma.recipe
            .findUniqueOrThrow({
                where,
                include: {
                    mixtures: true,
                    resources: true,
                    parent: true,
                    variants: true,
                },
            })
            .catch(() => {
                throw new HttpError(404, 'Recipe not found');
            });

        return recipe;
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
            include: {
                mixtures: true,
                resources: true,
                parent: true,
                variants: true,
            },
        });
    }

    async findAllVariants(
        params: IPagination & {
            cursor?: Prisma.RecipeWhereUniqueInput;
            where?: Prisma.RecipeWhereInput;
            orderBy?: Prisma.RecipeOrderByWithAggregationInput;
            recipeId: number;
        }
    ): Promise<RecipeDto[]> {
        const { page, limit, cursor, orderBy, recipeId } = params;

        return this.prisma.recipe.findMany({
            take: limit,
            skip: limit! * (page! - 1),
            where: {
                parentId: recipeId,
            },
            orderBy,
            cursor,
            include: {
                mixtures: true,
                resources: true,
                parent: true,
                variants: true,
            },
        });
    }

    async update(
        id: number,
        data: Prisma.RecipeUpdateInput
    ): Promise<RecipeDto> {
        if (!(await this.exists({ id }))) {
            throw new HttpError(409, 'Recipe does not exists');
        }

        return this.prisma.recipe.update({
            data,
            where: { id },
        });
    }

    async updateVariant(
        id: number,
        parentId: number,
        data: Prisma.RecipeUpdateInput
    ): Promise<RecipeDto> {
        await this.prisma.recipe
            .findUniqueOrThrow({ where: { id, parentId } })
            .catch(() => {
                throw new HttpError(404, `Recipe does not exists`);
            });

        return this.prisma.recipe.update({
            data,
            where: { id, parentId },
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
