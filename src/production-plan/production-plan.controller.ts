import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class ProductionPlanController {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getResultsByProductionPlan(req: Request, res: Response) {
        const { id } = req.params;
        const results = await this.prisma.productionResults.findMany({
            where: { productionPlanId: Number(id) },
        });
        return res.send(results);
    }

    async createResult(req: Request, res: Response) {
        const { id } = req.params;
        const newResult = await this.prisma.productionResults.create({
            data: { productionPlanId: Number(id), ...req.body },
        });
        return res.send(newResult);
    }
}
