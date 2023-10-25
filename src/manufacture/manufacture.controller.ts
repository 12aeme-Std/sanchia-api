import validateSchema from '@middlewares/validation.mid';
import { ManufactureService } from './manufacture.service';
import { Request, Response } from 'express';
import { createManufactureSchema } from './manufacture.validator';
import { PrismaClient } from '@prisma/client';

export class ManufactureController {
    private readonly manufactureService: ManufactureService;
    private readonly prisma: PrismaClient;

    constructor() {
        this.manufactureService = new ManufactureService();
        this.prisma = new PrismaClient();
    }

    async create(req: Request, res: Response) {
        validateSchema(req.body, createManufactureSchema);

        return res
            .status(200)
            .json(await this.manufactureService.create(req.body));
    }

    async findOne(req: Request, res: Response) {
        return res.status(200).json(
            await this.manufactureService.findOne({
                id: Number(req.params.id),
            })
        );
    }

    async findAll(req: Request, res: Response) {
        const manufactures = await this.manufactureService.findAll({
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 15),
        });

        return res.status(200).json(manufactures);
    }

    async finishManufactureProcess(req: Request, res: Response) {
        // validateSchema(req.body, createResultSchema);

        return res
            .status(200)
            .json(
                await this.manufactureService.finishManufactureProcess(req.body)
            );
    }

    async getManufactureProductsWithRecipe(req: Request, res: Response) {
        const recipes = await this.prisma.manufactureProduct.findMany({
            include: {
                recipe: {
                    include: { resources: { include: { rawMaterial: true } } },
                },
            },
        });

        return res.send(recipes);
    }
}
