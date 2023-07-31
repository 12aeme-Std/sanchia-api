import {
    Prisma,
    PrismaClient,
    WarehouseMovement,
    WarehouseType,
} from '@prisma/client';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CreateMovementDto } from './dtos/create-movement.dto';
import { HttpError } from '@common/http-error';

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

            if (
                !data.warehouseDestinationId &&
                !data.mixMachineId &&
                !data.manufactureMachineId
            )
                throw new HttpError(400, 'p');

            let mov: WarehouseMovement;

            if (data.warehouseDestinationId) {
                const { id } = await tx.warehouse.findUniqueOrThrow({
                    where: { id: data.warehouseDestinationId },
                });

                mov = await tx.warehouseMovement.create({
                    data: {
                        user: {
                            connect: { id: data.userId },
                        },
                        quantity: data.quantity,
                        type: data.type,
                        warehouseOrigin: {
                            connect: { id: rawMaterial.warehouseId },
                        },
                        warehouseDestination: {
                            connect: {
                                id,
                            },
                        },
                        rawMaterial: {
                            connect: {
                                id: data.rawMaterialId,
                            },
                        },
                    },
                });
            } else if (data.mixMachineId) {
                const { id } = await tx.mixtureMachine.findUniqueOrThrow({
                    where: { id: data.mixMachineId },
                });

                mov = await tx.warehouseMovement.create({
                    data: {
                        user: {
                            connect: { id: data.userId },
                        },
                        quantity: data.quantity,
                        type: data.type,
                        warehouseOrigin: {
                            connect: { id: rawMaterial.warehouseId },
                        },
                        mixtureMachine: {
                            connect: {
                                id,
                            },
                        },
                        rawMaterial: {
                            connect: {
                                id: data.rawMaterialId,
                            },
                        },
                    },
                });
            } else {
                const { id } = await tx.manufactureMachine.findUniqueOrThrow({
                    where: { id: data.manufactureMachineId },
                });

                mov = await tx.warehouseMovement.create({
                    data: {
                        user: {
                            connect: { id: data.userId },
                        },
                        quantity: data.quantity,
                        type: data.type,
                        warehouseOrigin: {
                            connect: { id: rawMaterial.warehouseId },
                        },
                        manufactureMachine: {
                            connect: {
                                id,
                            },
                        },
                        rawMaterial: {
                            connect: {
                                id: data.rawMaterialId,
                            },
                        },
                    },
                });
            }

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

    async findByType({ type }: { type: WarehouseType }) {
        return this.prisma.warehouseMovement.findMany({
            where: { type },
        });
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
