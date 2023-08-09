import { Prisma, PrismaClient } from '@prisma/client';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CreateManufactureDto } from './dtos/create-manufacture.dto';
import { CreateManufactureResultDto } from './dtos/create-result.dto';

export class ManufactureService {
    private readonly prisma: PrismaClient;

    // Constructor: Initializes the PrismaClient instance
    constructor() {
        this.prisma = new PrismaClient();
    }

    // Method to create a new manufacture
    async create(data: CreateManufactureDto) {
        return this.prisma.$transaction(async (tx) => {
            // Retrieve the associated machine for the manufacture
            const machine = await tx.manufactureMachine.findUniqueOrThrow({
                where: { id: data.manufactureMachineId },
            });

            // Check if a manufacture with the same name already exists
            const manufactureExists = await tx.manufacture.findUnique({
                where: { name: data.name },
            });

            if (manufactureExists)
                throw new HttpError(
                    400,
                    `Manufacture with name ${data.name} already exists`
                );

            // Create the manufacture and connect it with the machine
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

            // Create and connect resources to the manufacture
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

            // Return the created manufacture with associated resources
            return tx.manufacture.findUniqueOrThrow({
                where: { id: manufacture.id },
                include: {
                    resources: true,
                },
            });
        });
    }

    // Method to find a manufacture by its unique identifier
    async findOne(where: Prisma.ManufactureWhereUniqueInput) {
        return this.prisma.manufacture
            .findUniqueOrThrow({ where })
            .catch(() => {
                throw new HttpError(404, 'Manufacture does not exist');
            });
    }

    // Method to find all manufactures based on pagination and filtering parameters
    async findAll(
        params: IPagination & {
            cursor?: Prisma.ManufactureWhereUniqueInput;
            where?: Prisma.ManufactureWhereInput;
            orderBy?: Prisma.ManufactureOrderByWithAggregationInput;
        }
    ) {
        const { page, limit, cursor, where, orderBy } = params;

        // Find and return multiple manufactures based on pagination and filtering parameters
        return this.prisma.manufacture.findMany({
            skip: page! - 1,
            take: limit,
            cursor,
            where,
            orderBy,
        });
    }

    // Method to create a manufacture result
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
