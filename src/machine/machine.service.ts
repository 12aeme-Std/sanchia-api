import { Prisma, PrismaClient } from '@prisma/client';
import { MachineDto } from './dtos/machine.dto';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';

export class MachineService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: Prisma.MachineCreateInput): Promise<MachineDto> {
        if (!this.exists({ name: data.name }))
            throw new HttpError(400, 'Machine already exists');

        return this.prisma.machine.create({ data });
    }

    async findOne(where: Prisma.MachineWhereUniqueInput): Promise<MachineDto> {
        return this.prisma.machine.findUniqueOrThrow({ where }).catch(() => {
            throw new HttpError(404, 'Machine does not exists');
        });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.MachineWhereUniqueInput;
            where?: Prisma.MachineWhereInput;
            orderBy?: Prisma.MachineOrderByWithAggregationInput;
        }
    ): Promise<MachineDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return this.prisma.machine.findMany({
            skip: page! - 1,
            take: limit,
            cursor,
            where,
            orderBy,
        });
    }

    async update(
        id: number,
        data: Prisma.MachineUpdateInput
    ): Promise<MachineDto> {
        if (!this.exists({ id }))
            throw new HttpError(404, 'Machine does not exists');

        return this.prisma.machine.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        if (!this.exists({ id }))
            throw new HttpError(404, 'Machine does not exists');

        await this.prisma.machine.delete({ where: { id } });
    }

    private async exists(where: Prisma.MachineWhereUniqueInput) {
        return (await this.prisma.machine.findUnique({ where })) !== null;
    }
}
