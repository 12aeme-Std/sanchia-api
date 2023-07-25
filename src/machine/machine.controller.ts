import { MachineService } from './machine.service';
import { Request, Response } from 'express';

export class MachineController {
    private readonly machineService: MachineService;

    constructor() {
        this.machineService = new MachineService();
    }

    async create(req: Request, res: Response) {
        return res.status(200).json(await this.machineService.create(req.body));
    }

    async findOne(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.machineService.findOne({ id: Number(req.params.id) })
            );
    }

    async findAll(req: Request, res: Response) {
        const machines = await this.machineService.findAll({
            page: Number(req.params.page ?? 1),
            limit: Number(req.params.limit ?? 15),
        });

        return res.status(200).json(machines);
    }

    async update(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.machineService.update(
                    Number(req.params.id),
                    req.body
                )
            );
    }

    async delete(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.machineService.delete(Number(req.params.id)));
    }
}
