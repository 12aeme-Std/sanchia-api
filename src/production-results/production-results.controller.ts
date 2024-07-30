import { Request, Response } from 'express';
import { PrismaClient, ProductionResultsStatus } from '@prisma/client';

export class ProductionResultsController {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async setResultAsSync(req: Request, res: Response) {
        const { id } = req.params;
        const updateRecord = await this.prisma.productionResults.update({
            where: { id: Number(id) },
            data: { status: ProductionResultsStatus.SYNC },
        });
        return res.send({ updateRecord });
    }
}
