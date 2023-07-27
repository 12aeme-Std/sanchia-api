import { ManufactureMachineService } from './manufacture-machine.service';
import { Request, Response } from 'express';

export class ManufactureMachineController {
    private readonly manufactureMachineService: ManufactureMachineService;

    constructor() {
        this.manufactureMachineService = new ManufactureMachineService();
    }

    async create(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.manufactureMachineService.create(req.body));
    }

    async findOne(req: Request, res: Response) {
        return res.status(200).json(
            await this.manufactureMachineService.findOne({
                id: Number(req.params.id),
            })
        );
    }

    async findAll(req: Request, res: Response) {
        const machines = await this.manufactureMachineService.findAll({
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 15),
        });

        return res.status(200).json(machines);
    }

    async update(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.manufactureMachineService.update(
                    Number(req.params.id),
                    req.body
                )
            );
    }

    async delete(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.manufactureMachineService.delete(
                    Number(req.params.id)
                )
            );
    }
}
