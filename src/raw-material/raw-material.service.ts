import { Prisma, PrismaClient } from '@prisma/client';
import { RawMaterialDto } from './dtos/raw-material.dto';
import { IPagination } from '@common/interfaces/pagination.interface';
import { HttpError } from '@common/http-error';
import { CreateRawMaterialDto } from './dtos/create-raw-material.dto';
import { WarehouseService } from '@warehouse/warehouse.service';

export class RawMaterialService {
    private readonly prisma: PrismaClient;
    private readonly warehouseService: WarehouseService;

    constructor() {
        this.prisma = new PrismaClient();
        this.warehouseService = new WarehouseService();
    }

    async create(data: CreateRawMaterialDto): Promise<RawMaterialDto> {
        // Check if the raw material with the same name already exists
        if (await this.exists({ name: data.name })) {
            throw new HttpError(409, 'Raw material already exists');
        }

        // Check if the specified warehouse exists
        if (!(await this.warehouseService.findOne({ id: data.warehouse }))) {
            throw new HttpError(404, 'Warehouse does not exist');
        }

        // Create a new raw material and connect it to the specified warehouse
        return this.prisma.rawMaterial.create({
            data: {
                ...data,
                warehouse: {
                    connect: {
                        id: data.warehouse,
                    },
                },
            },
        });
    }

    async findOne(
        where: Prisma.RawMaterialWhereUniqueInput
    ): Promise<RawMaterialDto> {
        // Find and return a specific raw material based on the provided unique identifier
        return this.prisma.rawMaterial.findUniqueOrThrow({ where });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.RawMaterialWhereUniqueInput;
            where?: Prisma.RawMaterialWhereInput;
            orderBy?: Prisma.RawMaterialOrderByWithAggregationInput;
        }
    ): Promise<RawMaterialDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        // Find and return multiple raw materials based on pagination and filtering parameters
        return this.prisma.rawMaterial.findMany({
            skip: page! - 1,
            take: limit,
            where,
            orderBy,
            cursor,
        });
    }

    async update(
        id: number,
        data: Prisma.RawMaterialUpdateInput
    ): Promise<RawMaterialDto> {
        // Check if the raw material with the provided ID exists
        if (!(await this.exists({ id }))) {
            throw new HttpError(404, 'Raw material does not exist');
        }

        // Update the raw material and return the updated data
        return this.prisma.rawMaterial.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        // Check if the raw material with the provided ID exists
        if (!(await this.exists({ id }))) {
            throw new HttpError(404, 'Raw material does not exist');
        }

        // Delete the raw material from the database
        await this.prisma.rawMaterial.delete({ where: { id } });
    }

    // Private method to check if a raw material exists based on the provided query
    private async exists(where: Prisma.RawMaterialWhereUniqueInput) {
        return (await this.prisma.rawMaterial.findUnique({ where })) !== null;
    }
}
