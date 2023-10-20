/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import {
    ManufactureMachine,
    PrismaClient,
    RawMaterial,
    ResourceOnRecipe,
} from '@prisma/client';

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

    async getReportData(req: Request, res: Response) {
        const rawData = await this.prisma.planning.findFirst({
            include: {
                PlanningSpec: {
                    include: {
                        PlanningSchedule: {
                            include: {
                                ProductionSpec: {
                                    include: {
                                        recipe: {
                                            include: {
                                                resources: {
                                                    include: {
                                                        rawMaterial: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        manufactureMachine: true,
                        ProductionSpec: {
                            include: {
                                recipe: {
                                    include: {
                                        resources: {
                                            include: {
                                                rawMaterial: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: { id: Number(req.params.id) },
        });

        const maquinas = rawData?.PlanningSpec.map((planSpec) => {
            return planSpec.manufactureMachine.name;
        });

        const resourcesOnMachines: Array<{
            machine: ManufactureMachine;
            resources:
                | Array<
                      ResourceOnRecipe & {
                          rawMaterial: RawMaterial | null;
                      }
                  >
                | undefined;
        }> = [];

        const rawMaterialsAndMachines: any = [];
        rawData?.PlanningSpec.forEach((planSpec) => {
            if (planSpec.isMultipleSchedule) {
                planSpec.PlanningSchedule.forEach((plannSche) => {
                    plannSche.ProductionSpec.forEach((prodSpec) => {
                        resourcesOnMachines.push({
                            machine: planSpec.manufactureMachine,
                            resources: prodSpec.recipe?.resources,
                        });
                    });
                });
            } else {
                planSpec.ProductionSpec.forEach((prodSpec) => {
                    resourcesOnMachines.push({
                        machine: planSpec.manufactureMachine,
                        resources: prodSpec.recipe?.resources,
                    });
                });
            }
        });

        const finalData: Array<{
            rawMaterial: any; // (RawMaterial & { requiredMaterial: number }) | null;
            machines: any; // Array<ManufactureMachine & { quanity: number }> | null;
        }> = [];

        resourcesOnMachines.forEach((row) => {
            row.resources?.forEach((raw) => {
                finalData.push({
                    rawMaterial: {
                        ...raw.rawMaterial,
                        totalRequiredMaterial: 0,
                    },
                    machines: [{ ...row.machine, requiredMaterial: 0 }],
                });
            });
        });

        res.send({
            maquinas,
            rows: finalData,
        });
    }
}
