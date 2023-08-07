import { Prisma, PrismaClient } from '@prisma/client';
import { MixtureDto } from './dtos/mixture.dtos';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CreateMixtureDto } from './dtos/create-mixture.dto';
import { CreateMixtureResultDto } from './dtos/create-result.dto';

export class MixtureService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: CreateMixtureDto) {
        return this.prisma.$transaction(async (tx) => {
            // Retrieve associated recipe and mixture machine for the new mixture
            const recipe = await tx.recipe.findUniqueOrThrow({
                where: { id: data.recipeId },
            });
            const machine = await tx.mixtureMachine.findUniqueOrThrow({
                where: { id: data.mixtureMachineId },
            });

            // Check if a mixture with the same name already exists
            const mixtureExists = await tx.mixture.findUnique({
                where: { name: data.name },
            });

            if (mixtureExists)
                throw new HttpError(
                    400,
                    `Mixture with name ${data.name} already exists`
                );

            // Create a new mixture and connect it with the recipe and machine
            const mixture = await tx.mixture.create({
                data: {
                    name: data.name,
                    recipe: {
                        connect: {
                            id: recipe.id,
                        },
                    },
                    mixtureMachine: {
                        connect: {
                            id: machine.id,
                        },
                    },
                },
            });

            // Create and connect raw materials to the mixture
            await Promise.all(
                data.materials.map(async (materialOnMixture) => {
                    const material = await tx.rawMaterial.findUniqueOrThrow({
                        where: { id: materialOnMixture.rawMaterialId },
                    });

                    // Check if raw material stock is enough for the recipe quantity
                    if (material.stock < recipe.quantity)
                        throw new HttpError(
                            400,
                            'Raw material stock is not enough'
                        );

                    // Create and connect raw materials to the mixture
                    return tx.rawMaterialOnMixture.create({
                        data: {
                            mixture: {
                                connect: {
                                    id: mixture.id,
                                },
                            },
                            rawMaterial: {
                                connect: {
                                    id: material.id,
                                },
                            },
                            quantity: materialOnMixture.quantity,
                        },
                    });
                })
            );

            // Return the created mixture with associated materials
            return tx.mixture.findUniqueOrThrow({
                where: { id: mixture.id },
                include: {
                    materials: true,
                },
            });
        });
    }

    async findOne(where: Prisma.MixtureWhereUniqueInput): Promise<MixtureDto> {
        return this.prisma.mixture.findUniqueOrThrow({ where }).catch(() => {
            throw new HttpError(404, 'Mixture does not exist');
        });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.MixtureWhereUniqueInput;
            where?: Prisma.MixtureWhereInput;
            orderBy?: Prisma.MixtureOrderByWithAggregationInput;
        }
    ): Promise<MixtureDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        // Find and return multiple mixtures based on pagination and filtering parameters
        return this.prisma.mixture.findMany({
            skip: page! - 1,
            take: limit,
            cursor,
            where,
            orderBy,
        });
    }

    async update(
        id: number,
        data: Prisma.MixtureUpdateInput
    ): Promise<MixtureDto> {
        // Check if the mixture with the provided ID exists
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Mixture does not exist');

        // Update the mixture and return the updated data
        return this.prisma.mixture.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        // Check if the mixture with the provided ID exists
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Mixture does not exist');

        // Delete the mixture from the database
        await this.prisma.mixture.delete({ where: { id } });
    }

    async createResult(data: CreateMixtureResultDto) {
        // Create a new mixture result and connect it with the specified mixture
        return this.prisma.mixtureResult.create({
            data: {
                mixture: {
                    connect: {
                        id: data.mixtureId,
                    },
                },
                finishedAt: data.finishedAt,
                quantity: data.quantity,
            },
        });
    }

    // Private method to check if a mixture exists based on the provided query
    private async exists(where: Prisma.MixtureWhereUniqueInput) {
        return (await this.prisma.mixture.findUnique({ where })) !== null;
    }
}
