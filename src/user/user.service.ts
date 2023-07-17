import { Prisma, PrismaClient } from '@prisma/client';

export class UserService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async register(data: Prisma.UserCreateInput) {
        
    }
}
