/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class PlanningController {
    private readonly prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    // ---------------------------------------------------------------------------------
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

    // ---------------------------------------------------------------------------------
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

    // ---------------------------------------------------------------------------------
    async createPlanningSchedule(req: Request, res: Response) {
        const createPlanningSchedule =
            await this.prisma.planningSchedule.create({ data: req.body });

        return res.send(createPlanningSchedule);
    }

    async getPlanningSchedulePlanningSpec(req: Request, res: Response) {
        const planningScheduleBySpec =
            await this.prisma.planningSchedule.findMany({
                where: { planningSpecId: Number(req.params.specId) },
            });
        return res.send(planningScheduleBySpec);
    }

    async getSinglePlanningSchedule(req: Request, res: Response) {
        const planningSchedule = await this.prisma.planningSchedule.findFirst({
            where: {
                id: Number(req.params.scheduleId),
                planningSpecId: Number(req.params.specId),
            },
        });
        return res.send(planningSchedule);
    }

    // ---------------------------------------------------------------------------------
    async createProductionSpec(req: Request, res: Response) {
        const productionSpec = await this.prisma.productionSpec.create({
            data: req.body,
        });

        return res.send(productionSpec);
    }

    async getProductionByPlanSpecOrSchedule(req: Request, res: Response) {
        const { kind } = req.query;
        let productionSpecs;
        if (kind === 'schedule') {
            productionSpecs = await this.prisma.productionSpec.findMany({
                where: {
                    planningScheduleId: Number(req.params.iden),
                },
            });
        } else {
            productionSpecs = await this.prisma.productionSpec.findMany({
                where: {
                    planningSpecId: Number(req.params.iden),
                },
            });
        }
        return res.send(productionSpecs);
    }
}
