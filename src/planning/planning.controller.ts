/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import {
    ManufactureMachine,
    PrismaClient,
    ProductionSpec,
    RawMaterial,
    ResourceOnRecipe,
} from '@prisma/client';
import sql from 'mssql';
import { CreateRawMaterialDto } from '@raw-material/dtos/create-raw-material.dto';
import _ from 'lodash';

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

        const maquinas =
            rawData?.PlanningSpec.map((planSpec) => {
                return planSpec.manufactureMachine.name;
            }) ?? [];

        const resourcesOnMachines: Array<{
            machine: ManufactureMachine;
            resources:
            | Array<
                ResourceOnRecipe & {
                    rawMaterial: RawMaterial | null;
                }
            >
            | undefined;
            production: ProductionSpec;
        }> = [];

        const rawMaterialsAndMachines: any = [];
        rawData?.PlanningSpec.forEach((planSpec) => {
            if (planSpec.isMultipleSchedule) {
                planSpec.PlanningSchedule.forEach((plannSche) => {
                    plannSche.ProductionSpec.forEach((prodSpec) => {
                        resourcesOnMachines.push({
                            machine: planSpec.manufactureMachine,
                            resources: prodSpec.recipe?.resources,
                            production: prodSpec,
                        });
                    });
                });
            } else {
                planSpec.ProductionSpec.forEach((prodSpec) => {
                    resourcesOnMachines.push({
                        machine: planSpec.manufactureMachine,
                        resources: prodSpec.recipe?.resources,
                        production: prodSpec,
                    });
                });
            }
        });

        const finalData: Array<{
            rawMaterial: any; // (RawMaterial & { requiredMaterial: number }) | null;
            machines: any[]; // Array<ManufactureMachine & { quanity: number }> | null;
        }> = [];

        resourcesOnMachines.forEach((row) => {
            row.resources?.forEach((raw) => {
                // Primero tengo que buscar el indice
                // Separa primer insercion a segunda
                const dataIndex = finalData.findIndex(
                    (data) => data.rawMaterial.id === raw.rawMaterial?.id
                );

                if (dataIndex >= 0) {
                    // Lo encontro
                    const schedule = rawData?.schedule === 'AM' ? 13 : 11;

                    finalData[dataIndex].machines.push({
                        ...row.machine,
                        requiredMaterial: Number(
                            (
                                ((schedule * 60 * 60) / row.production.cycles) *
                                raw.requiredMaterial
                            ).toFixed(4)
                        ),
                    });

                    finalData[dataIndex].rawMaterial.totalRequiredMaterial =
                        Number(
                            _.sumBy(
                                finalData[dataIndex].machines,
                                'requiredMaterial'
                            ).toFixed(4)
                        );
                } else {
                    // Es nuevo
                    const schedule = rawData?.schedule === 'AM' ? 13 : 11;
                    finalData.push({
                        rawMaterial: {
                            ...raw.rawMaterial,
                            totalRequiredMaterial: Number(
                                (
                                    ((schedule * 60 * 60) /
                                        row.production.cycles) *
                                    raw.requiredMaterial
                                ).toFixed(4)
                            ),
                        },
                        machines: [
                            {
                                ...row.machine,
                                requiredMaterial: Number(
                                    (
                                        ((schedule * 60 * 60) /
                                            row.production.cycles) *
                                        raw.requiredMaterial
                                    ).toFixed(4)
                                ),
                            },
                        ],
                    });
                }
            });
        });

        res.send({
            maquinas,
            rows: finalData,
        });
    }

    async syncData(req: Request, res: Response) {
        try {
            await sql.connect({
                user: 'olimporeader',
                password: 'olimporeader',
                database: 'master',
                server: 'sanchia.bitconsultores.net',
                port: 2034,
                pool: {
                    max: 10,
                    min: 0,
                    idleTimeoutMillis: 30000,
                },
                options: {
                    encrypt: false,
                    trustServerCertificate: false,
                },
            });

            const result = await sql.query`
                SELECT 
                    MXP.mxprId,
                    CP.cprNombre as [categoria],
                    PR.proId as [prodId],
                    PR.proCodigo AS [codigoProducto],
                    PR.proNombre As [nombreProducto],
                    MT.proId as [matId],
                    MT.proCodigo AS [codigoMaterial],
                    MT.proNombre AS [nombreMaterial],
                    PR.cprId as [idCategorias],
                    MXP.*
                FROM 
                    olComun.dbo.MaterialesXProducto MXP
                LEFT JOIN olComun.dbo.Productos PR WITH (NOLOCK) on MXP.proId = PR.proId
                LEFT JOIN olComun.dbo.Productos MT WITH (NOLOCK) on MXP.proIdMaterial  = MT.proId
                LEFT JOIN olComun.dbo.CategoriasProductos CP WITH (NOLOCK) on CP.cprId = MT.cprId
                where MT.cprId = 2644; 
            `;
            const creationData: any[] = [];
            result.recordset.forEach((product: any) => {
                // Condicion para si existe
                const dataIndex = creationData.findIndex(
                    (data) => data.olimId === product.matId
                );

                if (dataIndex < 0) {
                    creationData.push({
                        olimId: product.matId,
                        code: product.codigoMaterial,
                        name: product.nombreMaterial,
                        category: product.categoria,
                        stock: 0,
                        warehouseId: 1,
                    });
                }
            });
            const createMaterials = await this.prisma.rawMaterial.createMany({
                data: creationData,
            });

            res.send(createMaterials);
        } catch (error) {
            res.send(error);
        }
    }
}
