import validateSchema from '@middlewares/validation.mid';
import { MixtureService } from './mixture.service';
import { Request, Response } from 'express';
import {
    CreateMixtureResultSchema,
    CreateMixtureSchema,
    UpdateMixtureSchema,
} from './mixture.validator';

export class MixtureController {
    private readonly mixtureService: MixtureService;

    constructor() {
        this.mixtureService = new MixtureService();
    }

    async create(req: Request, res: Response) {
        validateSchema(req.body, CreateMixtureSchema);

        return res.status(200).json(await this.mixtureService.create(req.body));
    }

    async findOne(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.mixtureService.findOne({ id: Number(req.params.id) })
            );
    }

    async findAll(req: Request, res: Response) {
        const mixtures = await this.mixtureService.findAll({
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 15),
        });

        return res.status(200).json(mixtures);
    }

    async findAllResults(req: Request, res: Response) {
        const mixtures = await this.mixtureService.findAllResults({
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 15),
        });

        return res.status(200).json(mixtures);
    }

    async update(req: Request, res: Response) {
        validateSchema(req.body, UpdateMixtureSchema);
        return res
            .status(200)
            .json(
                await this.mixtureService.update(
                    Number(req.params.id),
                    req.body
                )
            );
    }

    async delete(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.mixtureService.delete(Number(req.params.id)));
    }

    async createResult(req: Request, res: Response) {
        validateSchema(req.body, CreateMixtureResultSchema);
        return res
            .status(200)
            .json(await this.mixtureService.createResult(req.body));
    }
}
