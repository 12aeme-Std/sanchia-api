/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { PrismaClient, MachineManagerType } from '@prisma/client';

export class ProductionIncidentController {
    private readonly prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getMachineManagers(req: Request, res: Response) {
        const { type } = req.query;
        const data = await this.prisma.machineManager.findMany({
            where: {
                kind: type as MachineManagerType,
                deleted: false,
            },
        });
        return res.send(data);
    }

    async createMachineManager(req: Request, res: Response) {
        const { body } = req;
        const data = await this.prisma.machineManager.createManyAndReturn({
            data: body,
        });
        res.send({ data });
    }

    async updateMachineManager(req: Request, res: Response) {
        const { body } = req;
        const data = await this.prisma.machineManager.update({
            where: {
                id: Number(req.params.id),
            },
            data: body,
        });
        res.send({ data });
    }

    async softDeleteMachineManager(req: Request, res: Response) {
        const data = await this.prisma.machineManager.update({
            where: {
                id: Number(req.params.id),
            },
            data: { deleted: true },
        });
        res.send({ data });
    }
}
