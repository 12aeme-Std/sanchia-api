import { WarehouseMovementService } from './warehouse-movement.service';
import { Request, Response } from 'express';

export class WarehouseMovementController {
    private readonly warehouseMovementService: WarehouseMovementService;

    constructor() {
        this.warehouseMovementService = new WarehouseMovementService();
    }

    async create(req: Request, res: Response) {
        return res.status(200).json(
            await this.warehouseMovementService.create({
                ...req.body,
                userId: req.user.id,
            })
        );
    }

    async findOne(req: Request, res: Response) {
        return res.status(200).json(
            await this.warehouseMovementService.findOne({
                id: Number(req.params.id),
            })
        );
    }

    async findByType(req: Request, res: Response) {
        const movements = await this.warehouseMovementService.findByType(
            req.body
        );
        return res.status(200).json(movements);
    }

    async findAll(req: Request, res: Response) {
        const warehouseMovements = await this.warehouseMovementService.findAll({
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 15),
        });

        return res.status(200).json(warehouseMovements);
    }
}
