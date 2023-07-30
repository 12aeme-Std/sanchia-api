import { Prisma, PrismaClient } from '@prisma/client';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CreateMovementDto } from './dtos/create-movement.dto';
import { HttpError } from '@common/http-error';

// TODO: Add method to filter by type

export class WarehouseMovementService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: CreateMovementDto) {
        return this.prisma.$transaction(async (tx) => {
            const rawMaterial = await tx.rawMaterial
                .findUniqueOrThrow({ where: { id: data.rawMaterialId } })
                .catch(() => {
                    throw new HttpError(404, 'Raw material does not exists');
                });

            if (rawMaterial.stock < data.quantity)
                throw new HttpError(400, 'Raw material stock is not enough');

            const mov = await tx.warehouseMovement.create({
                data: {
                    user: {
                        connect: { id: data.userId },
                    },
                    quantity: data.quantity,
                    type: data.type,
                    warehouseOrigin: {
                        connect: { id: rawMaterial.warehouseId },
                    },
                    warehouseDestination:
                        data.warehouseDestinationId !== undefined
                            ? {
                                  connect: {
                                      id: data.warehouseDestinationId,
                                  },
                              }
                            : undefined,
                    mixtureMachine:
                        data.mixMachineId !== undefined
                            ? {
                                  connect: {
                                      id: data.mixMachineId,
                                  },
                              }
                            : undefined,
                    manufactureMachine:
                        data.manufactureMachineId !== undefined
                            ? {
                                  connect: {
                                      id: data.manufactureMachineId,
                                  },
                              }
                            : undefined,
                    rawMaterial: {
                        connect: {
                            id: data.rawMaterialId,
                        },
                    },
                },
            });

            // TODO: Check this type
            if (data.type === 'MIXTURE_TO_MACHINE') {
                await tx.rawMaterial.update({
                    data: {
                        ...rawMaterial,
                        stock: rawMaterial.stock - data.quantity,
                    },
                    where: {
                        id: rawMaterial.id,
                    },
                });
            }

            return mov;
        });
    }

    async findOne(where: Prisma.WarehouseMovementWhereUniqueInput) {
        return this.prisma.warehouseMovement.findUniqueOrThrow({ where });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.WarehouseMovementWhereUniqueInput;
            where?: Prisma.WarehouseMovementWhereInput;
            orderBy?: Prisma.WarehouseMovementOrderByWithAggregationInput;
        }
    ) {
        const { page, limit, cursor, where, orderBy } = params;

        return this.prisma.warehouseMovement.findMany({
            skip: limit! * (page! - 1),
            take: limit,
            where,
            orderBy,
            cursor,
        });
    }
}
