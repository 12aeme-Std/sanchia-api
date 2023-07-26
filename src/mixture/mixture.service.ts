import { Prisma, PrismaClient } from '@prisma/client';
import { MixtureDto } from './dtos/mixture.dtos';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';

export class MixtureService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // TODO: Connect with recipes
    // TODO: Check raw material to allow this method
    async create(data: Prisma.MixtureCreateInput): Promise<MixtureDto> {
        if (!this.exists({ name: data.name }))
            throw new HttpError(400, 'Mixture already exists');

        return this.prisma.mixture.create({ data });
    }

    async findOne(where: Prisma.MixtureWhereUniqueInput): Promise<MixtureDto> {
        return this.prisma.mixture.findUniqueOrThrow({ where }).catch(() => {
            throw new HttpError(404, 'Mixture does not exists');
        });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.MixtureWhereUniqueInput;
            where?: Prisma.MixtureWhereInput;
            orderBy?: Prisma.MixtureOrderByWithAggregationInput;
        }
    ): Promise<MixtureDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return this.prisma.mixture.findMany({
            skip: page! - 1,
            take: limit,
            cursor,
            where,
            orderBy,
        });
    }

    async update(
        id: number,
        data: Prisma.MixtureUpdateInput
    ): Promise<MixtureDto> {
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Mixture does not exists');

        return this.prisma.mixture.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Mixture does not exists');

        await this.prisma.mixture.delete({ where: { id } });
    }

    private async exists(where: Prisma.MixtureWhereUniqueInput) {
        return (await this.prisma.mixture.findUnique({ where })) !== null;
    }
}
