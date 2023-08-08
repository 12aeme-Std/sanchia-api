import validateSchema from '@middlewares/validation.mid';
import { ManufactureService } from './manufacture.service';
import { Request, Response } from 'express';
import {
    createManufactureSchema,
    createResultSchema,
} from './manufacture.validator';

export class ManufactureController {
    private readonly manufactureService: ManufactureService;

    constructor() {
        this.manufactureService = new ManufactureService();
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
            page: Number(req.params.page ?? 1),
            limit: Number(req.params.limit ?? 15),
        });

        return res.status(200).json(manufactures);
    }

    async createResult(req: Request, res: Response) {
        validateSchema(req.body, createResultSchema);

        return res
            .status(200)
            .json(await this.manufactureService.createResult(req.body));
    }
}
