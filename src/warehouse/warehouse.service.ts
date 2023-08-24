import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { Prisma, PrismaClient } from '@prisma/client';
import { WarehouseDto } from './dtos/warehouse.dto';
import { CreateWarehouseDto } from './dtos/create-warehouse.dto';

export class WarehouseService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: CreateWarehouseDto): Promise<WarehouseDto> {
        if (await this.exists({ name: data.name })) {
            throw new HttpError(409, 'Warehouse already exists');
        }

        return this.prisma.warehouse.create({ data });
    }

    async findOne(
        where: Prisma.WarehouseWhereUniqueInput
    ): Promise<WarehouseDto> {
        return this.prisma.warehouse
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

        return this.prisma.warehouse.findMany({
            skip: limit! * (page! - 1),
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
        if (!(await this.exists({ id }))) {
            throw new HttpError(404, 'Warehouse does not exists');
        }

        return this.prisma.warehouse.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        if (!(await this.exists({ id }))) {
            throw new HttpError(404, 'Warehouse does not exists');
        }

        await this.prisma.warehouse.delete({ where: { id } });
    }

    private async exists(where: Prisma.WarehouseWhereUniqueInput) {
        return (await this.prisma.warehouse.findUnique({ where })) !== null;
    }
}
