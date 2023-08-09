import { Prisma, PrismaClient } from '@prisma/client';
import { ManufactureMachineDto } from './dtos/manufacture-machine.dto';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { CreateManufactureMachineDto } from './dtos/create-manufacture-machine.dto';
import { UpdateManufactureMachineDto } from './dtos/update-manufacture-machine.dto';

export class ManufactureMachineService {
    private readonly prisma: PrismaClient;

    // Constructor: Initializes the PrismaClient instance
    constructor() {
        this.prisma = new PrismaClient();
    }

    // Method to create a new manufacture machine
    async create(
        data: CreateManufactureMachineDto
    ): Promise<ManufactureMachineDto> {
        // Check if a machine with the same name already exists
        if (await this.exists({ name: data.name }))
            throw new HttpError(400, 'Machine already exists');

        // Create and return a new machine in the database
        return this.prisma.manufactureMachine.create({ data });
    }

    // Method to find a manufacture machine by its unique identifier
    async findOne(
        where: Prisma.ManufactureMachineWhereUniqueInput
    ): Promise<ManufactureMachineDto> {
        // Find a unique machine based on the provided query
        // If not found, throw a NotFound error
        return this.prisma.manufactureMachine
            .findUniqueOrThrow({ where })
            .catch(() => {
                throw new HttpError(404, 'Machine does not exist');
            });
    }

    // Method to find all manufacture machines based on pagination and filtering parameters
    async findAll(
        params: IPagination & {
            cursor?: Prisma.ManufactureMachineWhereUniqueInput;
            where?: Prisma.ManufactureMachineWhereInput;
            orderBy?: Prisma.ManufactureMachineOrderByWithAggregationInput;
        }
    ): Promise<ManufactureMachineDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        // Find and return multiple machines based on pagination and filtering parameters
        return this.prisma.manufactureMachine.findMany({
            skip: page! - 1,
            take: limit,
            cursor,
            where,
            orderBy,
        });
    }

    // Method to update a manufacture machine by its ID
    async update(
        id: number,
        data: UpdateManufactureMachineDto
    ): Promise<ManufactureMachineDto> {
        // Check if the machine with the provided ID exists
        if (!this.exists({ id }))
            throw new HttpError(404, 'Machine does not exist');

        // Update the machine and return the updated data
        return this.prisma.manufactureMachine.update({
            data,
            where: { id },
        });
    }

    // Method to delete a manufacture machine by its ID
    async delete(id: number): Promise<void> {
        // Check if the machine with the provided ID exists
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Machine does not exist');

        // Delete the machine from the database
        await this.prisma.manufactureMachine.delete({ where: { id } });
    }

    // Private method to check if a machine exists based on the provided query
    private async exists(where: Prisma.ManufactureMachineWhereUniqueInput) {
        return (
            (await this.prisma.manufactureMachine.findUnique({ where })) !==
            null
        );
    }
}
