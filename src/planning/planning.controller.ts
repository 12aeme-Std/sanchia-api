/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import {
    ManufactureMachine,
    PrismaClient,
    ProductionSpec,
    RawMaterial,
    Recipe,
    ResourceOnRecipe,
    ManufactureProduct,
    PlanningStatus,
    Prisma,
} from '@prisma/client';
import sql, { connect } from 'mssql';
import { CreateRawMaterialDto } from '@raw-material/dtos/create-raw-material.dto';
import _ from 'lodash';
import axios from 'axios';

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
        // const plans = await this.prisma.planning.findMany();
        const plans = await this.prisma.planning.findMany({});
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
            include: {
                supervisor: true,
                manufactureMachine: true,
                PlanningSchedule: {
                    include: {
                        ProductionSpec: {
                            include: {
                                manufactureProduct: true,
                                recipe: {
                                    include: {
                                        resources: {
                                            include: { rawMaterial: true },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                ProductionSpec: {
                    include: {
                        manufactureProduct: true,
                        recipe: {
                            include: {
                                resources: { include: { rawMaterial: true } },
                            },
                        },
                    },
                },
            },
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

    async updateProductionSpec(req: Request, res: Response) {
        // const { pid } = req.params;
        try {
            delete req.body.id;
            const productionSpec = await this.prisma.productionSpec.update({
                data: req.body,
                where: { id: Number(req.params.pid) },
            });

            return res.send(productionSpec);
        } catch (error) {
            return res.send({ error });
        }
    }

    async deleteProductionSpec(req: Request, res: Response) {
        const { pid } = req.params;
        const productionSpec = await this.prisma.productionSpec.delete({
            where: { id: Number(pid) },
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
        try {
            const rawData = await this.prisma.planning.findFirst({
                include: {
                    PlanningSpec: {
                        include: {
                            PlanningSchedule: {
                                include: {
                                    ProductionSpec: {
                                        include: {
                                            manufactureProduct: true,
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
                                    manufactureProduct: true,
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
            const { data: productionChargesRawMaterial }: { data: any[] } =
                await axios.request({
                    maxBodyLength: Infinity,
                    url: 'http://apisanchia.bitconsultores.net/olimpows/inventario/pull',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:
                            'Bearer MslSazTz1XvFsMb443zoQnt0io8qtVcLwTESvTCz4uVFXd7L1fnNi9Fz9vJW',
                    },
                    data: {
                        Ubicacion: 'UBI07PRODUCCION',
                        IdComercio: 'TPRC006',
                    },
                });
            // const productionChargesRawMaterial: any[] = [];

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
                product: ManufactureProduct;
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
                                product:
                                    prodSpec.manufactureProduct as ManufactureProduct,
                            });
                        });
                    });
                } else {
                    planSpec.ProductionSpec.forEach((prodSpec) => {
                        resourcesOnMachines.push({
                            machine: planSpec.manufactureMachine,
                            resources: prodSpec.recipe?.resources,
                            production: prodSpec,
                            product:
                                prodSpec.manufactureProduct as ManufactureProduct,
                        });
                    });
                }
            });

            const finalData: Array<{
                product: ManufactureProduct;
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
                                    ((schedule * 60 * 60 -
                                        row.production.leisureTime) /
                                        row.production.cycles) *
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
                            product: row.product,
                            rawMaterial: {
                                ...raw.rawMaterial,
                                alternativeStock:
                                    productionChargesRawMaterial.find(
                                        (aRawMaterial) =>
                                            aRawMaterial.Codigo ===
                                            raw.rawMaterial?.code
                                    )?.Saldo,
                                totalRequiredMaterial: Number(
                                    (
                                        ((schedule * 60 * 60 -
                                            row.production.leisureTime) /
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
                                            ((schedule * 60 * 60 -
                                                row.production.leisureTime) /
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

            return res.send({
                maquinas,
                rows: finalData,
            });
        } catch (error) {
            return res.send({ error });
        }
    }

    async syncMaterials(req: Request, res: Response) {
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
                CP.cprNombre as [categoria],
                PR.proCodigo AS [codigoProducto],
                PR.proNombre As [nombreProducto],
                MT.proCodigo AS [codigoMaterial],
                MT.proNombre AS [nombreMaterial],
                PR.cprId as [idCategorias],
                MXP.*
            FROM 
                olComun.dbo.MaterialesXProducto MXP
            LEFT JOIN olComun.dbo.Productos PR WITH (NOLOCK) on MXP.proId = PR.proId
            LEFT JOIN olComun.dbo.Productos MT WITH (NOLOCK) on MXP.proIdMaterial  = MT.proId
            LEFT JOIN olComun.dbo.CategoriasProductos CP WITH (NOLOCK) on CP.cprId = MT.cprId
            WHERE MT.cprId in (2647, 2645, 2595, 2644, 2648);
            `;
            const dataFromOlimpo = result.recordset;
            const creationData: any[] = [];
            dataFromOlimpo.forEach((product: any) => {
                // Condicion para si existe
                const dataIndex = creationData.findIndex(
                    (data) => data.code === product.codigoMaterial
                );

                if (dataIndex < 0) {
                    creationData.push({
                        olimId: product.proIdMaterial,
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

            res.send({ createMaterials });
        } catch (error) {
            res.send(error);
        }
    }

    async syncProducts(req: Request, res: Response) {
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
                CP.cprNombre as [categoria],
                PR.proCodigo AS [codigoProducto],
                PR.proNombre As [nombreProducto],
                MT.proCodigo AS [codigoMaterial],
                MT.proNombre AS [nombreMaterial],
                PR.cprId as [idCategorias],
                MXP.*
            FROM 
                olComun.dbo.MaterialesXProducto MXP
            LEFT JOIN olComun.dbo.Productos PR WITH (NOLOCK) on MXP.proId = PR.proId
            LEFT JOIN olComun.dbo.Productos MT WITH (NOLOCK) on MXP.proIdMaterial  = MT.proId
            LEFT JOIN olComun.dbo.CategoriasProductos CP WITH (NOLOCK) on CP.cprId = MT.cprId
            WHERE MT.cprId in (2647, 2645, 2595, 2644, 2648);
            `;
            const dataFromOlimpo = result.recordset;
            const creationData: any[] = [];
            dataFromOlimpo.forEach((product: any) => {
                // Condicion para si existe
                const dataIndex = creationData.findIndex(
                    (data) => data.code === product.codigoProducto
                );

                if (dataIndex < 0) {
                    creationData.push({
                        olimId: product.proId,
                        code: product.codigoProducto,
                        name: product.nombreProducto,
                    });
                }
            });
            const createProducts =
                await this.prisma.manufactureProduct.createMany({
                    data: creationData,
                });

            res.send(createProducts);
        } catch (error) {
            res.send(error);
        }
    }

    async syncRecipes(req: Request, res: Response) {
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
                CP.cprNombre as [categoria],
                PR.proCodigo AS [codigoProducto],
                PR.proNombre As [nombreProducto],
                MT.proCodigo AS [codigoMaterial],
                MT.proNombre AS [nombreMaterial],
                PR.cprId as [idCategorias],
                MXP.*
            FROM 
                olComun.dbo.MaterialesXProducto MXP
            LEFT JOIN olComun.dbo.Productos PR WITH (NOLOCK) on MXP.proId = PR.proId
            LEFT JOIN olComun.dbo.Productos MT WITH (NOLOCK) on MXP.proIdMaterial  = MT.proId
            LEFT JOIN olComun.dbo.CategoriasProductos CP WITH (NOLOCK) on CP.cprId = MT.cprId
            WHERE MT.cprId in (2647, 2645, 2595, 2644, 2648);
            `;
            const dataFromOlimpo = result.recordset;
            const creationData: any[] = [];
            dataFromOlimpo.forEach((product: any) => {
                // Condicion para si existe
                const dataIndex = creationData.findIndex(
                    (data) => data.code === product.codigoProducto
                );

                if (dataIndex < 0) {
                    creationData.push({
                        code: product.codigoProducto,
                        name: `${String(product?.nombreProducto)} | Default`,
                        description: `Recipe for product: ${String(
                            product?.nombreProducto
                        )}`,
                        resources: dataFromOlimpo.filter(
                            (mat) =>
                                mat.nombreProducto === product.nombreProducto
                        ),
                    });
                }
            });

            const recipes = await Promise.all(
                creationData.map(async (rawRecipe) => {
                    const materialsIds = rawRecipe.resources.map(
                        (mat: any) => mat.codigoMaterial
                    );
                    const materials = await this.prisma.rawMaterial.findMany({
                        where: { code: { in: materialsIds } },
                    });

                    const recipeResources: Prisma.ResourceOnRecipeCreateManyRecipeInputEnvelope =
                        {
                            data: materials.map((mat) => {
                                const quantity = rawRecipe.resources.find(
                                    (rawMat: any) =>
                                        mat.code === rawMat.codigoMaterial
                                ).mxprCantidad;

                                return {
                                    rawMaterialId: Number(mat.id),
                                    requiredMaterial: quantity,
                                };
                            }),
                        };
                    const manuProduct =
                        await this.prisma.manufactureProduct.findFirst({
                            where: { code: rawRecipe.code },
                        });
                    const finalRecipe: Prisma.RecipeCreateInput = {
                        name: rawRecipe.name,
                        description: rawRecipe.description,
                        quantity: 1,
                        manufactureProduct: {
                            connect: { id: manuProduct?.id },
                        },
                        resources: { createMany: recipeResources },
                    };
                    return finalRecipe;
                })
            );

            // const createRecipes = await this.prisma.recipe.createMany({
            //     data: recipes,
            // });

            const incompletedPromises = recipes.map(async (recipe) => {
                return this.prisma.recipe.create({ data: recipe });
            });
            const resolvedPromises = await Promise.all(incompletedPromises);
            // const singleRecipe = await this.prisma.recipe.create({
            //     data: {
            //         name: "Silla Eterna Café - - | Default",
            //         description: "Recipe for product: Silla Eterna Café - -",
            //         quantity: 1,
            //         manufactureProduct: {
            //             connect: {
            //                 id: 6,
            //             },
            //         },
            //         resources: {
            //             createMany: {
            //                 data: [
            //                     {

            //                         rawMaterialId: 59,
            //                         requiredMaterial: 2.699,
            //                     },
            //                     {
            //                         rawMaterialId: 60,
            //                         requiredMaterial: 0.0675,
            //                     },
            //                     {
            //                         rawMaterialId: 61,
            //                         requiredMaterial: 0.0135,
            //                     },
            //                 ],
            //             },
            //         },
            //     }
            // })

            res.send(resolvedPromises);
        } catch (error) {
            res.send(error);
        }
    }

    async syncStocks(req: Request, res: Response) {
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
            SELECT PR.proId 
                , PR.proCodigo AS [codProducto] 
                , PR.proNombre AS [name] 
                , SUM(ISNULL(SA.sliSaldo, 0)) AS [saldo] 
                , ISNULL(NULLIF(SUM(ISNULL(SA.sliSaldoReservado, 0)), 0), ISNULL(VTA.SumaSalidasVenSinPost, 0)) AS [reservado]
                , SUM(ISNULL(SA.sliSaldo, 0)) - ISNULL(NULLIF(SUM(ISNULL(SA.sliSaldoReservado, 0)), 0), ISNULL(VTA.SumaSalidasVenSinPost, 0)) AS [stock]
            FROM olComun.dbo.Productos PR WITH (NOLOCK)
                LEFT JOIN olInventario.dbo.Saldos SA WITH (NOLOCK) ON SA.proId = PR.proId 
                LEFT JOIN olComun.dbo.Marcas MAR WITH (NOLOCK) ON PR.marId = MAR.marId 
                LEFT JOIN (
                            SELECT COM.proId, PRV.prvId  
                                , PRV.prvNombre + ISNULL(' [NRC: ' + NULLIF(RTRIM(PRV.prvRegistroIva), '') + ']', ISNULL(' [NIT: ' + NULLIF(RTRIM(PRV.prvNIT), '') + ']', ' [Cod.: ' + PRV.prvCodigo + ']')) AS prvInfo
                            FROM (
                                    SELECT MMO.prvId 
                                        , DMO.proId 
                                        , MAX(MMO.mmoFecha) AS UltFecCompra
                                        , ROW_NUMBER() OVER (PARTITION BY DMO.proId ORDER BY MMO.mmoFecHoraPosteado DESC) AS RowNum
                                    FROM olInventario.dbo.maeMovi MMO WITH (NOLOCK)
                                        INNER JOIN olInventario.dbo.detMovi DMO WITH (NOLOCK) ON MMO.mmoId = DMO.mmoId 
                                        INNER JOIN olInventario.dbo.TiposMovi TMO WITH (NOLOCK) ON MMO.tmoId = TMO.tmoId AND TMO.tmoCodigo = 'COM' 
                                    WHERE MMO.mmoPosteado = 1 
                                    AND MMO.mmoAnulado = 0 
                                    AND MMO.prvId IS NOT NULL 
                                    GROUP BY MMO.prvId 
                                        , DMO.proId
                                        , MMO.mmoFecHoraPosteado
                                ) COM 
                                    INNER JOIN olComun.dbo.Proveedores PRV WITH (NOLOCK) ON COM.prvId = PRV.prvId AND PRV.prvId <> -100
                            WHERE COM.RowNum = 1
                        ) PRV ON PRV.proId = PR.proId 
                LEFT JOIN (
                            SELECT DMO.proId
                                , DMO.mloId
                                , DMO.ubiId
                                , SUM(DMO.dmoCantidad) AS SumaSalidasVenSinPost
                            FROM olInventario.dbo.detMovi DMO WITH (NOLOCK)
                                INNER JOIN olInventario.dbo.maeMovi MMO WITH (NOLOCK) ON DMO.mmoId = MMO.mmoId AND MMO.mmoPosteado = 0 AND MMO.mmoAnulado = 0
                                INNER JOIN olInventario.dbo.TiposMovi TMO WITH (NOLOCK) ON MMO.tmoId = TMO.tmoId AND TMO.tmoCodigo = 'VEN'
                            GROUP BY DMO.proId
                                , DMO.mloId
                                , DMO.ubiId
                        ) VTA ON VTA.proId = SA.proId AND ISNULL(VTA.mloId, -1) = ISNULL(SA.mloId, -1) AND ISNULL(VTA.ubiId,olInventario.dbo.GetDefaultUBI()) = SA.ubiId
                LEFT JOIN (
                            SELECT proId
                                , prvInfo
                                , prvId
                            FROM (
                                    SELECT PX.proId, PX.prvId
                                        , PRV.prvNombre + ISNULL(' [NRC: ' + NULLIF(RTRIM(PRV.prvRegistroIva), '') + ']', ISNULL(' [NIT: ' + NULLIF(RTRIM(PRV.prvNIT), '') + ']', ' [Cod.: ' + PRV.prvCodigo + ']')) AS prvInfo
                                        , PX.pxpDefault
                                        , ROW_NUMBER() OVER (PARTITION BY PX.proId ORDER BY PX.pxpDefault) AS PXPRowNum
                                    FROM olComun.dbo.ProductosXProveedor PX WITH (NOLOCK)
                                        INNER JOIN olComun.dbo.Proveedores PRV WITH (NOLOCK) ON PRV.prvId = PX.prvId 
                                ) PXPR
                            WHERE PXPR.PXPRowNum = 1
                        ) PXP ON PXP.proId = PR.proId
            WHERE PR.proTipo = 0 AND PR.cprId in (2647, 2645, 2595, 2644, 2648)
            GROUP BY PR.proCodigo 
                , PR.proId 
                , SA.mloId 
                , SA.ubiId 
                , PR.proCosto 
                , PR.cprId 
                , MAR.marNombre 
                , PRV.prvId  
                , ISNULL(VTA.SumaSalidasVenSinPost, 0)
                , PXP.prvId 
                , PR.proNombre
            ORDER BY PR.proNombre;`;

            const { recordset: dataFromOlimpo } = result;
            const updateData: any[] = [];
            dataFromOlimpo.forEach((product: any) => {
                console.log({ id: product.proId, stock: product.stock });
                if (product.proId) {
                    updateData.push(
                        this.prisma.rawMaterial.update({
                            where: { olimId: product.proId },
                            data: { stock: product.stock },
                        })
                    );
                }
            });
            const insertedData = await Promise.all(updateData);
            res.send(insertedData);
        } catch (error) {
            res.send({ error });
        }
    }

    async syncStocksFromOlimpoApi(req: Request, res: Response) {
        const { body: data } = req;
        const updatePromises = await Promise.all(
            data.map(async (rawMaterial: any): Promise<any> => {
                return await this.prisma.rawMaterial.updateMany({
                    where: { code: rawMaterial?.Codigo },
                    data: { stock: rawMaterial?.Saldo },
                });
            })
        );

        return res.send({ updatePromises });
    }

    async syncAux(req: Request, res: Response) {
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
          CP.cprNombre as [categoria],
          PR.proCodigo AS [codigoProducto],
          PR.proNombre As [nombreProducto],
          MT.proCodigo AS [codigoMaterial],
          MT.proNombre AS [nombreMaterial],
          PR.cprId as [idCategorias],
          MXP.*
      FROM 
          olComun.dbo.MaterialesXProducto MXP
      LEFT JOIN olComun.dbo.Productos PR WITH (NOLOCK) on MXP.proId = PR.proId
      LEFT JOIN olComun.dbo.Productos MT WITH (NOLOCK) on MXP.proIdMaterial  = MT.proId
      LEFT JOIN olComun.dbo.CategoriasProductos CP WITH (NOLOCK) on CP.cprId = MT.cprId
      WHERE MT.cprId in (2580, 2627);
      `;
            const newDataFromOlimpo = result.recordset;
            const creationData: any[] = [];
            const recipes = await this.prisma.recipe.findMany({
                where: {
                    manufactureProduct: { olimId: { not: null } },
                    manufactureProductId: { not: null },
                },
                include: { manufactureProduct: true },
            });

            const productsWRecipeWResources: any = [];
            recipes.forEach((recipe) => {
                const parcedRecipe = newDataFromOlimpo.filter(
                    (chargeAndHand) =>
                        chargeAndHand.proId ===
                        recipe.manufactureProduct?.olimId
                );
                const recipeResources = parcedRecipe.map((res) => {
                    return {
                        recipeId: recipe.id,
                        rawMaterialId:
                            res.nombreMaterial ===
                            'Mano de Obra Directa Maquina'
                                ? 176
                                : 177,
                        requiredMaterial: res.mxprCantidad,
                    };
                });
                productsWRecipeWResources.push(...recipeResources);
            });
            const createResources =
                await this.prisma.resourceOnRecipe.createManyAndReturn({
                    data: productsWRecipeWResources,
                });

            res.send({ createResources });
        } catch (error) {
            res.send({ error });
        }
    }

    /*
      1. Revisar productos nuevos - Done
      2. Revisar por materiales nuevos - Done
      3. Crear recetas
    */
    async syncOlimpo(req: Request, res: Response) {
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
    CP.cprNombre as [categoria],
    PR.proId AS [olimId],
    PR.proCodigo AS [codigoProducto],
    PR.proNombre As [nombreProducto],
    MT.proId AS [materialId],
    MT.proCodigo AS [codigoMaterial],
    MT.proNombre AS [nombreMaterial],
    PR.cprId as [idCategorias],
    MXP.*
FROM 
    olComun.dbo.MaterialesXProducto MXP
LEFT JOIN olComun.dbo.Productos PR WITH (NOLOCK) on MXP.proId = PR.proId
LEFT JOIN olComun.dbo.Productos MT WITH (NOLOCK) on MXP.proIdMaterial  = MT.proId
LEFT JOIN olComun.dbo.CategoriasProductos CP WITH (NOLOCK) on CP.cprId = MT.cprId
WHERE MT.cprId in (2647, 2645, 2595, 2644, 2648, 2580, 2627);
`;
            const olimpoProducts = result.recordset;
            const productCreationData: any[] = [];
            const materialCreationData: any[] = [];
            let createProducts: any = null;
            let createMaterials: any = null;

            const dbProducts = await this.prisma.manufactureProduct.findMany();
            const dbMaterials = await this.prisma.rawMaterial.findMany();

            // Busca materiales nuevos
            olimpoProducts.forEach((product: any) => {
                // Condicion para si existe
                const productDataIndex = productCreationData.findIndex(
                    (data) => data.code === product.codigoProducto
                );
                const productCurrectSearchByCode = dbProducts.find(
                    (dbProduct) => dbProduct.code === product.codigoProducto
                );
                const productCurrectSearchByOlimId = dbProducts.find(
                    (dbProduct) => dbProduct.olimId === product.proId
                );
                const productCurrectSearchByName = dbMaterials.find(
                    (dbProduct) => dbProduct.name === product.nombreProducto
                );

                const materialDataIndex = materialCreationData.findIndex(
                    (data) => data.code === product.codigoMaterial
                );
                const materialCurrectSearch = dbMaterials.find(
                    (dbMaterial) => dbMaterial.code === product.codigoMaterial
                );
                const materialCurrectSearchByName = dbMaterials.find(
                    (dbMaterial) => dbMaterial.name === product.nombreMaterial
                );

                if (
                    // No tiene que existir en su propio array
                    productDataIndex < 0 &&
                    // No tiene que ser encontrado por codigo
                    !productCurrectSearchByCode &&
                    // No tiene que ser encontrado por olimid
                    !productCurrectSearchByOlimId &&
                    !productCurrectSearchByName
                ) {
                    productCreationData.push({
                        olimId: product.proId,
                        code: product.codigoProducto,
                        name: product.nombreProducto,
                    });
                }

                if (
                    materialDataIndex < 0 &&
                    !materialCurrectSearch &&
                    !materialCurrectSearchByName
                ) {
                    materialCreationData.push({
                        olimId: product.proIdMaterial,
                        code: product.codigoMaterial,
                        name: product.nombreMaterial,
                        category: product.categoria,
                        stock: 0,
                        warehouseId: 1,
                    });
                }
            });

            const groupedRecipes = _.groupBy(olimpoProducts, 'proId');

            const possibleRecipes: any = [];
            _.forEach(groupedRecipes, function (value, key) {
                possibleRecipes.push(value);
            });

            // const data = groupedRecipes.entries[1];
            // console.log(productCreationData);
            if (productCreationData) {
                // return res.send({ productCreationData, olimpoProducts });
                createProducts =
                    await this.prisma.manufactureProduct.createManyAndReturn({
                        data: productCreationData,
                    });
            }
            if (materialCreationData) {
                createMaterials =
                    await this.prisma.rawMaterial.createManyAndReturn({
                        data: materialCreationData,
                    });
            }

            /*
              tengo que buscar los productos que no tienen receta, 
              asi con su id, busco en el groupedRecipes, y puedo crear su receta
            */
            if (createProducts) {
                // Se crean los productos junto con su receta
                const manufactureProductWithoutRecipe =
                    await this.prisma.manufactureProduct.findMany({
                        where: { Recipe: { none: {} } },
                    });

                if (!manufactureProductWithoutRecipe) {
                    return res.send({ message: 'nothing to update' });
                }
                // Refresh raw materials
                const updatedRawMaterials =
                    await this.prisma.rawMaterial.findMany();

                const newRecipes = manufactureProductWithoutRecipe.map(
                    async (mProduct) => {
                        const rawData = groupedRecipes[
                            mProduct?.olimId ?? 0
                        ].map((rawRecipe) => {
                            const currentMaterial = updatedRawMaterials.find(
                                (rawMaterial) =>
                                    rawMaterial.code ===
                                    rawRecipe.codigoMaterial
                            );
                            if (!currentMaterial) return null;
                            return {
                                rawMaterialId: currentMaterial?.id,
                                requiredMaterial: rawRecipe.mxprCantidad,
                            };
                        });
                        const data = _.compact(rawData);
                        if (!data) return null;

                        return this.prisma.recipe.create({
                            data: {
                                name: `${mProduct.name} | Olimpo`,
                                description: `Receta del producto: ${mProduct.name}`,
                                quantity: 0,
                                manufactureProduct: {
                                    connect: {
                                        id: mProduct.id,
                                    },
                                },
                                resources: {
                                    createMany: { data },
                                },
                            },
                        });
                    }
                );

                const createNewRecipes = await Promise.all(
                    _.compact(newRecipes)
                );
                res.send({
                    createProducts,
                    createMaterials,
                    createNewRecipes,
                    newRecipes,
                    manufactureProductWithoutRecipe,
                    possibleRecipes,
                    productCreationData,
                    materialCreationData,
                });
            } else {
                // Solo se crean los materiales nuevos
                res.send({
                    createProducts,
                    createMaterials,
                    possibleRecipes,
                    productCreationData,
                    materialCreationData,
                });
            }
        } catch (error) {
            res.send({ error });
        }
    }

    async getActivePlan(req: Request, res: Response) {
        const activePlan = await this.prisma.planning.findFirst({
            where: { status: PlanningStatus.ACTIVE },
        });
        return res.send(activePlan);
    }

    async updatePlanningStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;

        // Si estoy mandando a activar una planificacion
        if (status === PlanningStatus.ACTIVE) {
            /*
              1. Reviso si existe una previa activada, si no hay ninguna activa, activo esta, si hay una, la desativo y prendo esta
              2. Reviso si tiene ProductionPlans, si tiene, solo cambio el estado, sino, los creo
            */

            const currentActivePlan = await this.prisma.planning.findFirst({
                where: {
                    status: PlanningStatus.ACTIVE,
                    id: { not: Number(id) },
                },
            });

            const data = [];
            if (currentActivePlan) {
                // Existe uno activo
                const setPlanInactive = await this.prisma.planning.update({
                    where: { id: currentActivePlan.id },
                    data: { status: PlanningStatus.INACTIVE },
                });
                data.push(setPlanInactive);

                const setNewPlanActive = await this.prisma.planning.update({
                    where: { id: Number(id) },
                    data: { status: PlanningStatus.ACTIVE },
                });
                data.push(setNewPlanActive);
            } else {
                const setPlanActive = await this.prisma.planning.update({
                    where: { id: Number(id) },
                    data: { status: PlanningStatus.ACTIVE },
                });
                data.push(setPlanActive);
            }

            // Check the productionPlans
            const productionPlans = await this.prisma.productionPlan.findMany({
                where: { planningId: Number(id) },
            });

            if (productionPlans.length === 0) {
                // Crearlos, no tiene else, por que si tiene no nos importa
                const currentPlanning = await this.prisma.planningSpec.findMany(
                    {
                        where: { planningId: Number(id) },
                        include: {
                            PlanningSchedule: {
                                include: {
                                    ProductionSpec: {
                                        include: {
                                            manufactureProduct: true,
                                        },
                                    },
                                },
                            },
                            ProductionSpec: {
                                include: {
                                    manufactureProduct: true,
                                },
                            },
                        },
                    }
                );

                const productionPlanningCreation = currentPlanning.map(
                    (planSpec) => {
                        if (planSpec.isMultipleSchedule) {
                            // Multiples por maquina
                            return planSpec.PlanningSchedule.map(
                                (planSchedule) => {
                                    const {
                                        ProductionSpec: [spec],
                                    } = planSchedule;
                                    return {
                                        planningId: Number(planSpec.planningId),
                                        manufactureProductId: Number(
                                            spec?.manufactureProductId
                                        ),
                                        manufactureMachineId: Number(
                                            planSpec.manufactureMachineId
                                        ),
                                        productionSpecId: Number(spec.id),
                                    };
                                }
                            );
                        } else {
                            // Solo uno
                            const [fIndexProductionSpec] =
                                planSpec.ProductionSpec;
                            return {
                                planningId: Number(planSpec.planningId),
                                manufactureProductId: Number(
                                    fIndexProductionSpec.manufactureProductId
                                ),
                                manufactureMachineId: Number(
                                    planSpec.manufactureMachineId
                                ),
                                productionSpecId: Number(
                                    fIndexProductionSpec.id
                                ),
                            };
                        }
                    }
                ) as Prisma.ProductionPlanCreateManyInput[];
                const createProductionPlans =
                    await this.prisma.productionPlan.createMany({
                        data: productionPlanningCreation,
                    });
                data.push(createProductionPlans);
            }

            return res.send({
                message: 'Plan was set as active',
                data,
            });
        } else if (status === PlanningStatus.INACTIVE) {
            const setCurrentPlanInactive = await this.prisma.planning.update({
                where: { id: Number(id) },
                data: { status: PlanningStatus.INACTIVE },
            });

            return res.send({
                message: 'Plan was set as inactive',
                data: [setCurrentPlanInactive],
            });
        }
        return res.status(400).send({
            message: 'status is not supported',
            data: [],
        });
    }

    async getProductionPlansByPlanning(req: Request, res: Response) {
        const { id: planId } = req.params;
        const productionPlans = await this.prisma.productionPlan.findMany({
            where: { planningId: Number(planId) },
            include: {
                planning: true,
                manufactureMachine: true,
                manufactureProduct: true,
                productionResults: true,
                productionSpec: {
                    include: {
                        planningSpec: { include: { supervisor: true } },
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
        });
        return res.send(productionPlans);
    }
}
