import { PrismaClient, Prisma } from '@prisma/client';
import { UserDto } from '../user/user.dto';
import bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { HttpError } from '../common/http-error';
import jwt from 'jsonwebtoken';

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

        return {
            token: jwt.sign(user, process.env.JWT_SECRET!),
        };
    }
}
