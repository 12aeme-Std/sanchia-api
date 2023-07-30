import { Prisma, PrismaClient } from '@prisma/client';
import { MixtureDto } from './dtos/mixture.dtos';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CreateMixtureDto } from './dtos/create-mixture.dto';

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

    private async exists(where: Prisma.MixtureWhereUniqueInput) {
        return (await this.prisma.mixture.findUnique({ where })) !== null;
    }
}
