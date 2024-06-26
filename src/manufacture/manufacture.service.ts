import { Prisma, PrismaClient } from '@prisma/client';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CreateManufactureDto } from './dtos/create-manufacture.dto';
import {
    CreateManufactureProductDto,
    CreateManufactureResultDto,
    FinishManufactureProcessDto,
} from './dtos/create-result.dto';

export class ManufactureService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: CreateManufactureDto) {
        return this.prisma.$transaction(async (tx) => {
            const machine = await tx.manufactureMachine
                .findUniqueOrThrow({
                    where: { id: data.manufactureMachineId },
                })
                .catch(() => {
                    throw new HttpError(404, 'Machine does not exists');
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
                    const mixtureResult = await tx.mixtureResult
                        .findUniqueOrThrow({
                            where: {
                                id: materialOnManufacture.mixtureResultId,
                            },
                        })
                        .catch(() => {
                            throw new HttpError(
                                404,
                                'Mixture result does not exists'
                            );
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
            .findUniqueOrThrow({
                where,
                include: { results: true, resources: true },
            })
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
            skip: limit! * (page! - 1),
            take: limit,
            cursor,
            where,
            orderBy,
            include: { results: true, resources: true },
        });
    }

    async finishManufactureProcess(data: FinishManufactureProcessDto) {
        const result = await this.createResult(data.result, data.manufactureId);
        const product = await this.createProduct(
            data.product,
            data.manufactureId
        );

        return {
            result,
            product,
        };
    }

    private async createResult(
        data: CreateManufactureResultDto,
        manufactureId: number
    ) {
        await this.findOne({ id: manufactureId });

        return this.prisma.manufactureResult.create({
            data: {
                ...data,
                manufactureId,
            },
        });
    }

    private async createProduct(
        data: CreateManufactureProductDto,
        manufactureId: number
    ) {
        await this.findOne({ id: manufactureId });

        return this.prisma.manufactureProduct.create({
            data: {
                ...data,
                manufactureId,
            },
        });
    }
}
