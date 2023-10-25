import { Prisma, PrismaClient } from '@prisma/client';
import { RawMaterialDto } from './dtos/raw-material.dto';
import { IPagination } from '@common/interfaces/pagination.interface';
import { HttpError } from '@common/http-error';
import { CreateRawMaterialDto } from './dtos/create-raw-material.dto';
import { WarehouseService } from '@warehouse/warehouse.service';

export class RawMaterialService {
    private readonly prisma: PrismaClient;
    private readonly warehouseService: WarehouseService;

    constructor(p?: PrismaClient) {
        this.prisma = p ?? new PrismaClient();
        this.warehouseService = new WarehouseService();
    }

    async create(data: CreateRawMaterialDto): Promise<RawMaterialDto> {
        if (await this.exists({ name: data.name })) {
            throw new HttpError(409, 'Raw material already exists');
        }

        if (!(await this.warehouseService.findOne({ id: data.warehouse })))
            throw new HttpError(404, 'Warehouse does not exists');

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

        return this.prisma.rawMaterial.findMany({
            skip: limit! * (page! - 1),
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
        if (!(await this.exists({ id }))) {
            throw new HttpError(404, 'Raw material does not exists');
        }

        return this.prisma.rawMaterial.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        if (!(await this.exists({ id }))) {
            throw new HttpError(404, 'Raw material does not exists');
        }

        await this.prisma.rawMaterial.delete({ where: { id } });
    }

    private async exists(where: Prisma.RawMaterialWhereUniqueInput) {
        return (await this.prisma.rawMaterial.findUnique({ where })) !== null;
    }
}
