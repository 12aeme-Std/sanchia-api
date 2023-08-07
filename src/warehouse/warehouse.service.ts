import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { Prisma, PrismaClient } from '@prisma/client';
import { WarehouseDto } from './dtos/warehouse.dto';

export class WarehouseService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: Prisma.WarehouseCreateInput): Promise<WarehouseDto> {
        // Check if a warehouse with the same name already exists
        if (await this.exists({ name: data.name })) {
            throw new HttpError(409, 'Warehouse already exists');
        }

        // Create a new warehouse
        return this.prisma.warehouse.create({ data });
    }

    async findOne(
        where: Prisma.WarehouseWhereUniqueInput
    ): Promise<WarehouseDto> {
        // Find and return a specific warehouse based on the provided unique identifier
        return this.prisma.warehouse
            .findUniqueOrThrow({
                where,
            })
            .catch(() => {
                throw new HttpError(404, 'Warehouse does not exist');
            });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.WarehouseWhereUniqueInput;
            where?: Prisma.WarehouseWhereInput;
            orderBy?: Prisma.WarehouseOrderByWithAggregationInput;
        }
    ): Promise<WarehouseDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        // Find and return multiple warehouses based on pagination and filtering parameters
        return this.prisma.warehouse.findMany({
            skip: page! - 1,
            take: limit,
            where,
            orderBy,
            cursor,
        });
    }

    async update(
        id: number,
        data: Prisma.WarehouseUpdateInput
    ): Promise<WarehouseDto> {
        // Check if the warehouse with the provided ID exists
        if (!(await this.exists({ id }))) {
            throw new HttpError(404, 'Warehouse does not exist');
        }

        // Update the warehouse information
        return this.prisma.warehouse.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        // Check if the warehouse with the provided ID exists
        if (!(await this.exists({ id }))) {
            throw new HttpError(404, 'Warehouse does not exist');
        }

        // Delete the warehouse from the database
        await this.prisma.warehouse.delete({ where: { id } });
    }

    // Private method to check if a warehouse exists based on the provided query
    private async exists(where: Prisma.WarehouseWhereUniqueInput) {
        return (await this.prisma.warehouse.findUnique({ where })) !== null;
    }
}
