import { Prisma, PrismaClient } from '@prisma/client';
import { MixtureMachineDto } from './dtos/mixture-machine.dto';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';

export class MixtureMachineService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(
        data: Prisma.MixtureMachineCreateInput
    ): Promise<MixtureMachineDto> {
        // Check if a mixture machine with the same name already exists
        if (await this.exists({ name: data.name }))
            throw new HttpError(400, 'Machine already exists');

        // Create a new mixture machine and return the created data
        return this.prisma.mixtureMachine.create({ data });
    }

    async findOne(
        where: Prisma.MixtureMachineWhereUniqueInput
    ): Promise<MixtureMachineDto> {
        // Find and return a specific mixture machine based on the provided unique identifier
        return this.prisma.mixtureMachine
            .findUniqueOrThrow({ where })
            .catch(() => {
                throw new HttpError(404, 'Machine does not exist');
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

        // Find and return multiple mixture machines based on pagination and filtering parameters
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
        // Check if the mixture machine with the provided ID exists
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Machine does not exist');

        // Update the mixture machine and return the updated data
        return this.prisma.mixtureMachine.update({
            data,
            where: { id },
        });
    }

    async delete(id: number): Promise<void> {
        // Check if the mixture machine with the provided ID exists
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Machine does not exist');

        // Delete the mixture machine from the database
        await this.prisma.mixtureMachine.delete({ where: { id } });
    }

    // Private method to check if a mixture machine exists based on the provided query
    private async exists(where: Prisma.MixtureMachineWhereUniqueInput) {
        return (
            (await this.prisma.mixtureMachine.findUnique({ where })) !== null
        );
    }
}
