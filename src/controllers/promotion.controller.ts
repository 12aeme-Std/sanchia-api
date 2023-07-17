import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';

class PromotionController {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    createPromotion = async (req: Request, res: Response) => {
        try {
            const { codeName, amount, quantity, type, enable } = req.body;
            const newPromotion = await this.prisma.promotion.create({
                data: { codeName, amount, quantity, type, enable },
            });
            return res.status(200).send({
                message: 'Promotion created successfully',
                newPromotion,
            });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    getPromotionById = async (req: Request, res: Response) => {
        try {
            const { promoId } = req.params;
            const promotion = await this.prisma.promotion.findFirst({
                where: { id: Number(promoId) },
            });
            return res.status(200).send({ promotion });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    getPromotions = async (req: Request, res: Response) => {
        try {
            const promotions = await this.prisma.promotion.findMany();
            return res.status(200).send({ promotions });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    updatePromotion = async (req: Request, res: Response) => {
        try {
            const { promoId } = req.params;
            const { codeName, amount, quantity, type, enable } = req.body;
            const updatePromotion = await this.prisma.promotion.update({
                where: { id: Number(promoId) },
                data: { codeName, amount, quantity, type, enable },
            });
            return res.status(200).send({
                message: 'product updated successfully',
                updatePromotion,
            });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    deletePromotion = async (req: Request, res: Response) => {
        try {
            const { promoId } = req.params;
            await this.prisma.promotion.delete({
                where: { id: Number(promoId) },
            });
            return res
                .status(200)
                .send({ message: 'promotion deleted successfully' });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };
}

export default PromotionController;
