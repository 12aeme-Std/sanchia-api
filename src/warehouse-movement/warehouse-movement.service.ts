import {
    Prisma,
    PrismaClient,
    WarehouseMovement,
    WarehouseMovementType,
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
            let mov: WarehouseMovement;

            if (data.rawMaterialId) {
                const rawMaterial = await tx.rawMaterial
                    .findUniqueOrThrow({
                        where: { id: data.rawMaterialId },
                    })
                    .catch(() => {
                        throw new HttpError(
                            404,
                            'Raw material does not exists'
                        );
                    });

                if (rawMaterial.stock < data.quantity)
                    throw new HttpError(
                        400,
                        'Raw material stock is not enough'
                    );

                if (data.type === 'WAREHOUSE_TO_WAREHOUSE') {
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

                    return mov;
                } else if (data.type === 'WAREHOUSE_TO_MIXTURE_MACHINE') {
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
                    console.log(mov);

                    return mov;
                }
            }

            if (data.mixtureResultId) {
                const mixture = await this.prisma.mixtureResult
                    .findUniqueOrThrow({
                        where: { id: data.mixtureResultId },
                    })
                    .catch(() => {
                        throw new HttpError(
                            404,
                            `Mixture ${data.mixtureResultId} does not exists`
                        );
                    });

                if (data.type === 'WAREHOUSE_TO_WAREHOUSE') {
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
                                connect: { id: mixture.warehouseId! },
                            },
                            warehouseDestination: {
                                connect: {
                                    id,
                                },
                            },
                            mixture: {
                                connect: {
                                    id: data.mixtureResultId,
                                },
                            },
                        },
                    });

                    return mov;
                } else if (data.type === 'MIXTURE_RESULT_TO_WAREHOUSE') {
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
                            warehouseDestination: {
                                connect: {
                                    id,
                                },
                            },
                            mixture: {
                                connect: {
                                    id: data.mixtureResultId,
                                },
                            },
                        },
                    });

                    return mov;
                } else if (data.type === 'WAREHOUSE_TO_MIXTURE_MACHINE') {
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
                            mixtureMachine: {
                                connect: {
                                    id,
                                },
                            },
                            mixture: {
                                connect: {
                                    id: data.mixtureResultId,
                                },
                            },
                        },
                    });

                    return mov;
                }
            }

            if (data.manufactureResultId) {
                const manufacture = await this.prisma.manufactureResult
                    .findUniqueOrThrow({
                        where: { id: data.manufactureResultId },
                    })
                    .catch(() => {
                        throw new HttpError(
                            404,
                            `Mixture ${data.manufactureResultId} does not exists`
                        );
                    });

                if (data.type === 'WAREHOUSE_TO_WAREHOUSE') {
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
                                connect: { id: manufacture.warehouseId! },
                            },
                            warehouseDestination: {
                                connect: {
                                    id,
                                },
                            },
                            manufactureResult: {
                                connect: {
                                    id: data.manufactureResultId,
                                },
                            },
                        },
                    });

                    return mov;
                } else if (data.type === 'MANUFACTURE_RESULT_TO_WAREHOUSE') {
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
                            warehouseDestination: {
                                connect: {
                                    id,
                                },
                            },
                            manufactureResult: {
                                connect: {
                                    id: data.manufactureResultId,
                                },
                            },
                        },
                    });

                    return mov;
                }
            }
        });
    }

    async findOne(where: Prisma.WarehouseMovementWhereUniqueInput) {
        return this.prisma.warehouseMovement.findUniqueOrThrow({ where });
    }

    async findByType({ type }: { type: WarehouseMovementType }) {
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
