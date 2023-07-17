import { type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { type CustomRequest } from '../utilities/models';

class CartController {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    addToCart = async (req: CustomRequest, res: Response) => {
        try {
            const { productId } = req.params;
            const clientId = Number(req.user?.id);

            if (!productId) {
                return res
                    .status(400)
                    .send({ message: 'Missing param productId' });
            }
            if (!clientId) {
                return res
                    .status(400)
                    .send({ message: 'Missing param clientId' });
            }

            const existInCart = await this.prisma.cart.findFirst({
                where: { clientId, productId: Number(productId) },
            });

            if (existInCart != null) {
                const addProduct = await this.prisma.cart.update({
                    where: { id: existInCart.id },
                    data: {
                        productId: Number(productId),
                        clientId,
                        quantity: existInCart.quantity + 1,
                    },
                });

                return res.status(200).send({
                    message: 'product added successfully',
                    addProduct,
                });
            } else {
                const addProduct = await this.prisma.cart.create({
                    data: {
                        productId: Number(productId),
                        clientId,
                    },
                });

                return res.status(200).send({
                    message: 'product added successfully',
                    addProduct,
                });
            }
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    removeToCart = async (req: CustomRequest, res: Response) => {
        try {
            const { productId } = req.params;
            const clientId = Number(req.user?.id);

            if (!productId || !clientId) {
                return res
                    .status(400)
                    .send({ message: 'Missing param: clientId or productId' });
            }

            const existInCart = await this.prisma.cart.findFirst({
                where: { productId: Number(productId), clientId },
            });

            if (existInCart == null) {
                return res.status(400).send({
                    message: 'that product doesnt exist in your cart',
                });
            }

            if (existInCart.quantity == 1) {
                await this.prisma.cart.delete({
                    where: { id: existInCart.id },
                });
                return res.status(200).send({ message: 'Product deleted' });
            }

            if (existInCart.quantity > 1) {
                const quantityUpdate = existInCart.quantity - 1;
                const productUpdate = await this.prisma.cart.update({
                    where: { id: existInCart.id },
                    data: {
                        quantity: quantityUpdate,
                    },
                });

                return res
                    .status(200)
                    .send({ message: 'Product deleted', productUpdate });
            }
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    getCart = async (req: CustomRequest, res: Response) => {
        try {
            const clientId = Number(req.user?.id);

            if (!clientId) {
                return res.status(404).send({ message: 'Missing param id' });
            }

            const clientCart = await this.prisma.cart.findMany({
                where: { clientId },
                include: { product: true },
            });

            if (!clientCart) {
                return res.status(404).send({ message: 'your cart is empty' });
            }

            const client = await this.prisma.client.findFirst({
                where: { id: clientId },
            });

            const clientName = client?.name;

            return res.status(200).send({
                user: clientName,
                clientCart,
            });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };
}

const cartController = new CartController();
export default cartController;
