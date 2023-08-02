import { PrismaClient, Prisma } from '@prisma/client';
import { UserDto } from '../user/dtos/user.dto';
import bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import jwt from 'jsonwebtoken';
import { HttpError } from '@common/http-error';

export class AuthService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    private async validateCredentials(
        query: Prisma.UserWhereUniqueInput,
        password: string
    ): Promise<UserDto | null> {
        const user = await this.prisma.user.findUnique({
            where: query,
        });

        const isValid = user
            ? await bcrypt.compare(password, user.password)
            : false;

        return isValid ? user : null;
    }

    async login({ email, password }: LoginDto) {
        const user = await this.validateCredentials({ email }, password);

        if (!user) throw new HttpError(401, 'Unauthorized');

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!
        );

        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                accessToken: token,
            },
        });

        return { token };
    }
}
