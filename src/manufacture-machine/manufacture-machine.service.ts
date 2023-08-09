import { Prisma, PrismaClient } from '@prisma/client';
import { ManufactureMachineDto } from './dtos/manufacture-machine.dto';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CreateManufactureMachineDto } from './dtos/create-manufacture-machine.dto';
import { UpdateManufactureMachineDto } from './dtos/update-manufacture-machine.dto';

export class ManufactureMachineService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(
        data: CreateManufactureMachineDto
    ): Promise<ManufactureMachineDto> {
        if (await this.exists({ name: data.name }))
            throw new HttpError(400, 'Machine already exists');

        return this.prisma.manufactureMachine.create({ data });
    }

    async findOne(
        where: Prisma.ManufactureMachineWhereUniqueInput
    ): Promise<ManufactureMachineDto> {
        return this.prisma.manufactureMachine
            .findUniqueOrThrow({ where })
            .catch(() => {
                throw new HttpError(404, 'Machine does not exists');
            });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.ManufactureMachineWhereUniqueInput;
            where?: Prisma.ManufactureMachineWhereInput;
            orderBy?: Prisma.ManufactureMachineOrderByWithAggregationInput;
        }
    ): Promise<ManufactureMachineDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return this.prisma.manufactureMachine.findMany({
            skip: page! - 1,
            take: limit,
            cursor,
            where,
            orderBy,
        });
    }

    async update(
        id: number,
        data: UpdateManufactureMachineDto
    ): Promise<ManufactureMachineDto> {
        if (!this.exists({ id }))
            throw new HttpError(404, 'Machine does not exists');

        return this.prisma.manufactureMachine.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Machine does not exists');

        await this.prisma.manufactureMachine.delete({ where: { id } });
    }

    private async exists(where: Prisma.ManufactureMachineWhereUniqueInput) {
        return (
            (await this.prisma.manufactureMachine.findUnique({ where })) !==
            null
        );
    }
}
