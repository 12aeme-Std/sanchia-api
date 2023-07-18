import { Prisma, PrismaClient } from '@prisma/client';
import { UserDto } from './user.dto';
import { HttpError } from '../common/http-error';
import bcrypt from 'bcrypt';

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

        return await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPwd,
            },
        });
    }

    async findOne(where: Prisma.UserWhereUniqueInput): Promise<UserDto | null> {
        return await this.prisma.user.findUniqueOrThrow({ where }).catch(() => {
            throw new HttpError(404, 'User not found');
        });
    }
}
