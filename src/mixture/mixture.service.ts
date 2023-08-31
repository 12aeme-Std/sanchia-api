import { Prisma, PrismaClient } from '@prisma/client';
import { MixtureDto } from './dtos/mixture.dtos';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CreateMixtureDto } from './dtos/create-mixture.dto';
import { CreateMixtureResultDto } from './dtos/create-result.dto';
import { MixtureResultDto } from './dtos/mixture-result.dto';

export class MixtureService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: CreateMixtureDto) {
        return this.prisma.$transaction(async (tx) => {
            const recipe = await tx.recipe.findUniqueOrThrow({
                where: { id: data.recipeId },
            });

            const machine = await tx.mixtureMachine.findUniqueOrThrow({
                where: { id: data.mixtureMachineId },
            });

            const mixtureExists = await tx.mixture.findUnique({
                where: { name: data.name },
            });

            if (mixtureExists)
                throw new HttpError(
                    400,
                    `Mixture with name ${data.name} already exists`
                );

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

            await Promise.all(
                data.materials.map(async (materialOnMixture) => {
                    const material = await tx.rawMaterial.findUniqueOrThrow({
                        where: { id: materialOnMixture.rawMaterialId },
                    });

                    if (material.stock < recipe.quantity)
                        throw new HttpError(
                            400,
                            'Raw material stock is not enough'
                        );

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
            throw new HttpError(404, 'Mixture does not exists');
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

        return this.prisma.mixture.findMany({
            skip: limit! * (page! - 1),
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
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Mixture does not exists');

        return this.prisma.mixture.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Mixture does not exists');

        await this.prisma.mixture.delete({ where: { id } });
    }

    async createResult(data: CreateMixtureResultDto) {
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

    async findAllResults(
        params: IPagination & {
            cursor?: Prisma.MixtureResultWhereUniqueInput;
            where?: Prisma.MixtureResultWhereInput;
            orderBy?: Prisma.MixtureResultOrderByWithAggregationInput;
        }
    ): Promise<MixtureResultDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return this.prisma.mixtureResult.findMany({
            skip: limit! * (page! - 1),
            take: limit,
            cursor,
            where,
            orderBy,
            include: {
                mixture: true,
            },
        });
    }

    private async exists(where: Prisma.MixtureWhereUniqueInput) {
        return (await this.prisma.mixture.findUnique({ where })) !== null;
    }
}
