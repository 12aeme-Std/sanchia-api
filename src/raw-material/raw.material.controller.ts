import { Request, Response } from 'express';
import { RawMaterialService } from './raw-material.service';

export class RawMaterialController {
    private readonly rawMaterialService: RawMaterialService;

    constructor() {
        this.rawMaterialService = new RawMaterialService();
    }

    async create(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.rawMaterialService.create(req.body));
    }

    async findOne(req: Request, res: Response) {
        return res.status(200).json(
            await this.rawMaterialService.findOne({
                id: Number(req.params.id),
            })
        );
    }

    async findAll(req: Request, res: Response) {
        const warehouse = await this.rawMaterialService.findAll({
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 15),
        });
        return res.status(200).json(warehouse);
    }

    async update(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.rawMaterialService.update(
                    Number(req.params.id),
                    req.body
                )
            );
    }

    async delete(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.rawMaterialService.delete(Number(req.params.id)));
    }
}
