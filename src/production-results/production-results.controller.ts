import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class ProductionResultsController {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async methodX(req: Request, res: Response) {}
}
