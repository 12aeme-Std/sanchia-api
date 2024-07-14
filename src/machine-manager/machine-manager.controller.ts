/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { PrismaClient, MachineManagerType } from '@prisma/client';

export class MachineManagerController {
    private readonly prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getMachineManagers(req: Request, res: Response) {
        const { type } = req.query;
        const data = await this.prisma.machineManager.findMany({
            where: {
                kind: type as MachineManagerType,
            },
        });
        return res.send(data);
    }
}
