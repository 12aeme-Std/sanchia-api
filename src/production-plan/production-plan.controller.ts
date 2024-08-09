import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class ProductionPlanController {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createProductionPlan(req: Request, res: Response) {}

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

    async getIncidentsByProductionPlan(req: Request, res: Response) {
        const { id } = req.params;
        const results = await this.prisma.productionIncident.findMany({
            where: { productionPlanId: Number(id) },
        });
        return res.send(results);
    }

    async createIncident(req: Request, res: Response) {
        const { id } = req.params;
        const newResult = await this.prisma.productionIncident.create({
            data: { productionPlanId: Number(id), ...req.body },
        });
        return res.send(newResult);
    }

    async closeProductioPlan(req: Request, res: Response) {
        const newResult = await this.prisma.productionPlan.update({
            where: { id: Number(req.params.id) },
            data: { isComplete: true },
        });
        return res.send(newResult);
    }
}
