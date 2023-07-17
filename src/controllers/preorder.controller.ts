import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { type CustomRequest } from '../utilities/models';

class PreOrderController {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    createPreOrder = async (req: CustomRequest, res: Response) => {
        try {
            const userId = Number(req.user?.id);
            const { products } = req.body;
            const { clientId } = req.params;
            if (!clientId || !userId || !products) {
                return res.status(404).send({ message: 'Missing values' });
            }

            const client = await this.prisma.client.findFirst({
                where: { id: Number(clientId) },
            });

            if (client == null) {
                return res
                    .status(404)
                    .send({ message: "that client doesn't exist" });
            }

            const createPreOrder = await this.prisma.preOrder.create({
                data: { clientId: Number(clientId), userId, products },
            });

            return res.status(200).send({
                message: 'preorder created successfully',
                createPreOrder,
            });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    getPreOrderByClientId = async (req: Request, res: Response) => {
        try {
            const { clientId } = req.params;
            const preOrder = await this.prisma.preOrder.findFirst({
                where: { clientId: Number(clientId) },
            });
            return res.status(200).send({ preOrder });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    getPreOrders = async (req: CustomRequest, res: Response) => {
        try {
            const userId = Number(req.user?.id);
            const preOrders = await this.prisma.preOrder.findMany({
                where: { userId: Number(userId) },
            });
            return res.status(200).send({ preOrders });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    updatePreOrder = async (req: Request, res: Response) => {
        try {
            const { products } = req.body;
            const { clientId } = req.params;
            const preOrderUpdate = await this.prisma.preOrder.update({
                where: { clientId: Number(clientId) },
                data: { products },
            });
            return res.status(200).send({
                message: 'preorder updated successfully',
                preOrderUpdate,
            });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    deletePreOrder = async (req: Request, res: Response) => {
        try {
            const { clientId } = req.params;
            if (!clientId) {
                return res.status(404).send({ message: 'missing params' });
            }
            await this.prisma.preOrder.delete({
                where: { clientId: Number(clientId) },
            });
            return res
                .status(200)
                .send({ message: 'preorder deleted successfully' });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };
}

const preOrderController = new PreOrderController();
export default preOrderController;
