import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';
import { Prisma, PrismaClient } from '@prisma/client';
import { CategoryDto } from './dtos/category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

// TODO: Check what roles can handle categories
export class CategoryService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // Method to create a new category
    async create(data: CreateCategoryDto): Promise<CategoryDto> {
        // Check if a category with the same name already exists
        if (await this.exists({ name: data.name }))
            throw new HttpError(409, 'Category already exists');

        // Create and return a new category in the database
        return this.prisma.category.create({ data });
    }

    // Method to find a category by its unique identifier
    async findOne(
        where: Prisma.CategoryWhereUniqueInput
    ): Promise<CategoryDto | null> {
        // Find a unique category based on the provided query
        // If not found, throw a NotFound error
        return this.prisma.category.findUniqueOrThrow({ where }).catch(() => {
            throw new HttpError(404, 'Category not found');
        });
    }

    // Method to find all categories based on pagination and filtering parameters
    async findAll(
        params: IPagination & {
            cursor?: Prisma.CategoryWhereUniqueInput;
            where?: Prisma.CategoryWhereInput;
            orderBy?: Prisma.CategoryOrderByWithAggregationInput;
        }
    ): Promise<CategoryDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        // Find and return multiple categories based on pagination and filtering parameters
        return this.prisma.category.findMany({
            skip: page! - 1,
            take: limit,
            cursor,
            orderBy,
            where,
        });
    }

    // Method to update a category by its ID
    async update(id: number, data: UpdateCategoryDto): Promise<CategoryDto> {
        // Check if the category with the provided ID exists
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Category does not exist');

        // TODO: Add method to verify that the new name does not exist

        // Update the category and return the updated data
        return this.prisma.category.update({ data, where: { id } });
    }

    // Method to delete a category by its ID
    async delete(id: number): Promise<void> {
        // Check if the category with the provided ID exists
        if (!(await this.exists({ id })))
            throw new HttpError(404, 'Category does not exist');

        // Delete the category from the database
        await this.prisma.category.delete({ where: { id } });
    }

    // Private method to check if a category exists based on the provided query
    private async exists(where: Prisma.CategoryWhereUniqueInput) {
        return (await this.prisma.category.findUnique({ where })) !== null;
    }
}
