import { Prisma, PrismaClient } from '@prisma/client';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CreateMovementDto } from './dtos/create-movement.dto';

// TODO: Add method to filter by type

export class WarehouseMovementService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // TODO: Update stock
    // TODO: Infer warehouse origin from raw material
    async create(data: CreateMovementDto) {
        return this.prisma.warehouseMovement.create({
            data: {
                user: {
                    connect: { id: data.userId },
                },
                quantity: data.quantity,
                type: data.type,
                warehouseOrigin: {
                    connect: { id: data.warehouseOriginId },
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
