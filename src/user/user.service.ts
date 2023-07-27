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
        const alreadyExists = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (alreadyExists) throw new HttpError(409, 'Account already exists');

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

    // TODO: Check who can udpate an user
    async update(
        id: number,
        data: Prisma.UserUpdateInput
    ): Promise<UserDto | null> {
        if (!(await this.userExists({ id })))
            throw new HttpError(404, 'User not found');

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

    // TODO: Check who can delete an user
    async delete(id: number): Promise<void> {
        if (!(await this.userExists({ id })))
            throw new HttpError(404, 'User not found');

        await this.prisma.user.delete({ where: { id } });
    }

    private async userExists(where: Prisma.UserWhereUniqueInput) {
        return (await this.prisma.user.findUnique({ where })) !== null;
    }
}
