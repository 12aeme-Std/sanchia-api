import validateSchema from '@middlewares/validation.mid';
import { MixtureMachineService } from './mixture-machine.service';
import { Request, Response } from 'express';
import {
    CreateMixtureMachineSchema,
    UpdateMixtureMachineSchema,
} from './mixture-machine.validator';

export class MixtureMachineController {
    private readonly mixtureMachineService: MixtureMachineService;

    constructor() {
        this.mixtureMachineService = new MixtureMachineService();
    }

    async create(req: Request, res: Response) {
        validateSchema(req.body, CreateMixtureMachineSchema);

        return res
            .status(200)
            .json(await this.mixtureMachineService.create(req.body));
    }

    async findOne(req: Request, res: Response) {
        return res.status(200).json(
            await this.mixtureMachineService.findOne({
                id: Number(req.params.id),
            })
        );
    }

    async findAll(req: Request, res: Response) {
        const machines = await this.mixtureMachineService.findAll({
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 15),
        });

        return res.status(200).json(machines);
    }

    async update(req: Request, res: Response) {
        validateSchema(req.body, UpdateMixtureMachineSchema);

        return res
            .status(200)
            .json(
                await this.mixtureMachineService.update(
                    Number(req.params.id),
                    req.body
                )
            );
    }

    async delete(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.mixtureMachineService.delete(Number(req.params.id))
            );
    }
}
