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

    // Method to create a new warehouse movement
    async create(data: CreateMovementDto) {
        // Using a transaction to ensure atomicity in database operations
        return this.prisma.$transaction(async (tx) => {
            // Fetching raw material based on its ID
            const rawMaterial = await tx.rawMaterial
                .findUniqueOrThrow({ where: { id: data.rawMaterialId } })
                .catch(() => {
                    throw new HttpError(404, 'Raw material does not exist');
                });

            // Checking if there's enough stock of raw material
            if (rawMaterial.stock < data.quantity)
                throw new HttpError(400, 'Raw material stock is not enough');

            // Checking for valid destination machines
            if (
                !data.warehouseDestinationId &&
                !data.mixMachineId &&
                !data.manufactureMachineId
            )
                throw new HttpError(400, 'Invalid movement destination');

            let mov: WarehouseMovement;

            // Creating a warehouse movement based on the destination machine type
            if (data.warehouseDestinationId) {
                // Handling warehouse destination case
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
                // Handling mixture machine case
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
                // Handling manufacture machine case
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
            // Updating raw material stock based on movement type
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

            return mov; // Returning the created movement
        });
    }

    // Method to find a warehouse movement by its unique identifier
    async findOne(where: Prisma.WarehouseMovementWhereUniqueInput) {
        return this.prisma.warehouseMovement.findUniqueOrThrow({ where });
    }

    // Method to find warehouse movements by type
    async findByType({ type }: { type: WarehouseType }) {
        return this.prisma.warehouseMovement.findMany({
            where: { type },
        });
    }

    // Method to find all warehouse movements with pagination and filtering
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
