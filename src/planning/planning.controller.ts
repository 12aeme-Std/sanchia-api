/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class PlanningController {
    private readonly prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(req: Request, res: Response) {
        const createPlanning = await this.prisma.planning.create({
            data: req.body,
        });
        return res.send(createPlanning);
    }

    async getPlans(req: Request, res: Response) {
        const plans = await this.prisma.planning.findMany();
        return res.send(plans);
    }

    async getSinglePlan(req: Request, res: Response) {
        const plans = await this.prisma.planning.findFirst({
            where: { id: Number(req.params.id) },
        });
        return res.send(plans);
    }

    async createPlanningSpecs(req: Request, res: Response) {
        const createPlanningPlanningSpec =
            await this.prisma.planningSpec.create({
                data: {
                    ...req.body,
                    planningId: Number(req.params.id),
                },
            });
        return res.send(createPlanningPlanningSpec);
    }

    async getPlanningSpecsByPlan(req: Request, res: Response) {
        const planningSpecs = await this.prisma.planningSpec.findMany({
            where: { planningId: Number(req.params.id) },
            include: { manufactureMachine: true, PlanningSchedule: true },
        });
        return res.send(planningSpecs);
    }

    async getSinglePlanningSpecs(req: Request, res: Response) {
        const planningSpecs = this.prisma.planningSpec.findMany({
            where: {
                id: Number(req.params.specId),
                planningId: Number(req.params.id),
            },
            include: { manufactureMachine: true, PlanningSchedule: true },
        });
        return res.send(planningSpecs);
    }

    async deletePlanningSpecs(req: Request, res: Response) {
        const deletePlanningPlanningSpec =
            await this.prisma.planningSpec.delete({
                where: { id: Number(req.params.id) },
            });
        return res.send(deletePlanningPlanningSpec);
    }

    async createPlanningSchedule(req: Request, res: Response) {
        const createPlanningSchedule =
            await this.prisma.planningSchedule.create({ data: req.body });

        return res.send(createPlanningSchedule);
    }

}
