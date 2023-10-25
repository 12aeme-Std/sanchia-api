import { Prisma, PrismaClient } from '@prisma/client';
import { MixtureMachineDto } from './dtos/mixture-machine.dto';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';

export class MixtureMachineService {
    private readonly prisma: PrismaClient;

    constructor(p?: PrismaClient) {
        this.prisma = p ?? new PrismaClient();
    }

    async create(
        data: Prisma.MixtureMachineCreateInput
    ): Promise<MixtureMachineDto> {
        if (await this.exists({ name: data.name }))
            throw new HttpError(400, 'Machine already exists');

        return this.prisma.mixtureMachine.create({ data });
    }

    async findOne(
        where: Prisma.MixtureMachineWhereUniqueInput
    ): Promise<MixtureMachineDto> {
        return this.prisma.mixtureMachine
            .findUniqueOrThrow({ where })
            .catch(() => {
                throw new HttpError(404, 'Machine does not exists');
            });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.MixtureMachineWhereUniqueInput;
            where?: Prisma.MixtureMachineWhereInput;
            orderBy?: Prisma.MixtureMachineOrderByWithAggregationInput;
        }
    ): Promise<MixtureMachineDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return this.prisma.mixtureMachine.findMany({
            skip: page! - 1,
            take: limit,
            cursor,
            where,
            orderBy,
        });
    }

    async update(
        id: number,
        data: Prisma.MixtureMachineUpdateInput
    ): Promise<MixtureMachineDto> {
        if (!this.exists({ id }))
            throw new HttpError(404, 'Machine does not exists');

        return this.prisma.mixtureMachine.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Machine does not exists');

        await this.prisma.mixtureMachine.delete({ where: { id } });
    }

    private async exists(where: Prisma.MixtureMachineWhereUniqueInput) {
        return (
            (await this.prisma.mixtureMachine.findUnique({ where })) !== null
        );
    }
}
