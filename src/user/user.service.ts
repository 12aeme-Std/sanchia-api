import { Prisma, PrismaClient } from '@prisma/client';
import { UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';

export class UserService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async register(data: Prisma.UserCreateInput): Promise<UserDto> {
        // Check if a user with the same email already exists
        const alreadyExists = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (alreadyExists) {
            throw new HttpError(409, 'Account already exists');
        }

        // Hash the password using bcrypt and create a new user
        const hashedPwd = await bcrypt.hash(
            data.password,
            Number(process.env.SALT ?? 10)
        );

        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPwd,
            },
        });
    }

    async findOne(where: Prisma.UserWhereUniqueInput): Promise<UserDto | null> {
        // Find and return a specific user based on the provided unique identifier
        return this.prisma.user.findUniqueOrThrow({ where }).catch(() => {
            throw new HttpError(404, 'User not found');
        });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.UserWhereUniqueInput;
            where?: Prisma.UserWhereInput;
            orderBy?: Prisma.UserOrderByWithAggregationInput;
        }
    ): Promise<UserDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        // Find and return multiple users based on pagination and filtering parameters
        return this.prisma.user.findMany({
            skip: page! - 1,
            take: limit,
            cursor,
            where,
            orderBy,
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                role: true,
            },
        });
    }

    // TODO: Check who can update a user
    async update(
        id: number,
        data: Prisma.UserUpdateInput
    ): Promise<UserDto | null> {
        // Check if the user with the provided ID exists
        if (!(await this.userExists({ id }))) {
            throw new HttpError(404, 'User not found');
        }

        // Hash the new password if provided, and update the user
        const hashedPwd = data.password
            ? await bcrypt.hash(
                  data.password as string,
                  Number(process.env.SALT)!
              )
            : undefined;

        return this.prisma.user.update({
            data: {
                ...data,
                password: hashedPwd,
            },
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                role: true,
            },
        });
    }

    // TODO: Check who can delete a user
    async delete(id: number): Promise<void> {
        // Check if the user with the provided ID exists
        if (!(await this.userExists({ id }))) {
            throw new HttpError(404, 'User not found');
        }

        // Delete the user from the database
        await this.prisma.user.delete({ where: { id } });
    }

    // Private method to check if a user exists based on the provided query
    private async userExists(where: Prisma.UserWhereUniqueInput) {
        return (await this.prisma.user.findUnique({ where })) !== null;
    }
}
