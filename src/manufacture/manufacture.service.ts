import { Prisma, PrismaClient } from '@prisma/client';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CreateManufactureDto } from './dtos/create-manufacture.dto';
import { CreateManufactureResultDto } from './dtos/create-result.dto';

export class ManufactureService {
    private readonly prisma: PrismaClient;

    constructor(p?: PrismaClient) {
        this.prisma = p ?? new PrismaClient();
    }

    async create(data: CreateManufactureDto) {
        return this.prisma.$transaction(async (tx) => {
            const machine = await tx.manufactureMachine.findUniqueOrThrow({
                where: { id: data.manufactureMachineId },
            });

            const manufactureExists = await tx.manufacture.findUnique({
                where: { name: data.name },
            });

            if (manufactureExists)
                throw new HttpError(
                    400,
                    `Manufacture with name ${data.name} already exists`
                );

            const manufacture = await tx.manufacture.create({
                data: {
                    name: data.name,
                    manufactureMachine: {
                        connect: {
                            id: machine.id,
                        },
                    },
                },
            });

            await Promise.all(
                data.resources.map(async (materialOnManufacture) => {
                    if (materialOnManufacture.rawMaterialId) {
                        const material = await tx.rawMaterial.findUniqueOrThrow(
                            {
                                where: {
                                    id: materialOnManufacture.rawMaterialId,
                                },
                            }
                        );

                        return tx.resourcesOnManufacture.create({
                            data: {
                                manufacture: {
                                    connect: {
                                        id: manufacture.id,
                                    },
                                },
                                rawMaterial: {
                                    connect: {
                                        id: material.id,
                                    },
                                },

                                quantity: materialOnManufacture.quantity,
                            },
                        });
                    } else if (materialOnManufacture.mixtureResultId) {
                        const mixtureResult =
                            await tx.mixtureResult.findUniqueOrThrow({
                                where: {
                                    id: materialOnManufacture.rawMaterialId,
                                },
                            });

                        return tx.resourcesOnManufacture.create({
                            data: {
                                manufacture: {
                                    connect: {
                                        id: manufacture.id,
                                    },
                                },
                                mixtureResult: {
                                    connect: {
                                        id: mixtureResult.id,
                                    },
                                },

                                quantity: materialOnManufacture.quantity,
                            },
                        });
                    }
                })
            );

            return tx.manufacture.findUniqueOrThrow({
                where: { id: manufacture.id },
                include: {
                    resources: true,
                },
            });
        });
    }

    async findOne(where: Prisma.ManufactureWhereUniqueInput) {
        return this.prisma.manufacture
            .findUniqueOrThrow({ where })
            .catch(() => {
                throw new HttpError(404, 'Manufacture does not exists');
            });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.ManufactureWhereUniqueInput;
            where?: Prisma.ManufactureWhereInput;
            orderBy?: Prisma.ManufactureOrderByWithAggregationInput;
        }
    ) {
        const { page, limit, cursor, where, orderBy } = params;

        return this.prisma.manufacture.findMany({
            skip: page! - 1,
            take: limit,
            cursor,
            where,
            orderBy,
        });
    }

    async createResult(data: CreateManufactureResultDto) {
        return this.prisma.manufactureResult.create({
            data: {
                manufacture: {
                    connect: {
                        id: data.manufactureId,
                    },
                },
                finishedAt: data.finishedAt,
                quantity: data.quantity,
            },
        });
    }
}
