import { WarehouseService } from './warehouse.service';
import { Request, Response } from 'express';

export class WarehouseController {
    private readonly warehouseService: WarehouseService;

    constructor() {
        this.warehouseService = new WarehouseService();
    }

    async create(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.warehouseService.create(req.body));
    }

    async findOne(req: Request, res: Response) {
        return res.status(200).json(
            await this.warehouseService.findOne({
                id: Number(req.params.id),
            })
        );
    }

    async findAll(req: Request, res: Response) {
        const warehouse = await this.warehouseService.findAll({
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 15),
        });
        return res.status(200).json(warehouse);
    }

    async update(req: Request, res: Response) {
        return await this.warehouseService.update(
            Number(req.params.id),
            req.body
        );
    }

    async delete(req: Request, res: Response) {
        return await this.warehouseService.delete(Number(req.params.id));
    }
}
