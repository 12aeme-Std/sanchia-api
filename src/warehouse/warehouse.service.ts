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
        if (!this.exists({ name: data.name })) {
            throw new HttpError(409, 'Warehouse already exists');
        }

        return await this.prisma.warehouse.create({ data });
    }

    async findOne(
        where: Prisma.WarehouseWhereUniqueInput
    ): Promise<WarehouseDto> {
        return await this.prisma.warehouse
            .findUniqueOrThrow({
                where,
            })
            .catch(() => {
                throw new HttpError(404, 'Warehouse does not exists');
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

        return await this.prisma.warehouse.findMany({
            take: page! - 1,
            skip: limit,
            where,
            orderBy,
            cursor,
        });
    }

    async update(
        id: number,
        data: Prisma.WarehouseUpdateInput
    ): Promise<WarehouseDto> {
        if (!this.exists({ id })) {
            throw new HttpError(409, 'Warehouse already exists');
        }

        return await this.prisma.warehouse.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        if (!this.exists({ id })) {
            throw new HttpError(409, 'Warehouse already exists');
        }

        await this.prisma.warehouse.delete({ where: { id } });
    }

    private async exists(where: Prisma.WarehouseWhereUniqueInput) {
        return (await this.prisma.warehouse.findUnique({ where })) !== null;
    }
}
