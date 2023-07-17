import { type Request, type Response } from 'express';
import { PrismaClient, PromotionType } from '@prisma/client';
import { type CustomRequest } from '../utilities/models';

class OrderController {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    createOrder = async (req: CustomRequest, res: Response) => {
        const clientId = req.user?.id;
        const { cupon } = req.body;

        if (!clientId) {
            return res.status(404).send({ message: 'you most SignIn' });
        }

        try {
            const getCart = await this.prisma.cart.findMany({
                where: { clientId },
                include: { product: true },
            });

            if (!getCart) {
                return res.status(404).send({ message: 'The order is empty' });
            }

            let total = 0;
            const stockChange: any = [];

            const orderDetail = getCart.map((cart) => {
                const productId = cart.productId;
                const quantity = cart.quantity;
                const newStock = cart.product.stock - quantity;

                const price = cart.product.price;
                const totalPerProduct = Number(price) * Number(quantity);
                total += totalPerProduct;

                stockChange.push(
                    this.prisma.product.update({
                        where: { id: productId },
                        data: {
                            stock: Number(newStock),
                        },
                    })
                );
                return { productId, quantity };
            });

            const firstTotal = total;
            let updateQuantity = 0;
            let cuponId = 0;
            let cuponValid = false;

            if (cupon) {
                const promo = await this.prisma.promotion.findFirst({
                    where: { codeName: cupon },
                });

                if (promo == null) {
                    return res
                        .status(404)
                        .send({ message: "Sorry the coupon doesn't exist" });
                }

                if (!promo.enable || promo.quantity === 0) {
                    return res
                        .status(404)
                        .send({ message: 'The coupon is not availiba' });
                }

                cuponId = promo.id;

                if (promo?.type === PromotionType.MONEY) {
                    total = total - Number(promo?.amount);
                    cuponValid = true;
                    if (total < 0) total = 0;
                }
                if (promo?.type === PromotionType.PORCENTAGE) {
                    cuponValid = true;
                    const porcentage = (promo.amount / 100) * total;
                    total = total - porcentage;
                }
                if (cuponValid) {
                    updateQuantity = promo.quantity - 1;
                } else {
                    updateQuantity = promo.quantity;
                }
            }

            const saving = firstTotal - total;
            const discount = firstTotal - saving;

            const createOrder = this.prisma.order.create({
                data: {
                    clientId,
                    total: firstTotal,
                    discountTotal: discount,
                    saving,
                    orderDetail: { create: orderDetail },
                },
            });

            const transaction = await this.prisma.$transaction([
                createOrder,
                ...stockChange,
            ]);
            const orderPurchased = await this.prisma.order.findFirst({
                where: { id: (await createOrder).id },
            });

            if (transaction && cuponValid) {
                await this.prisma.promotion.update({
                    where: { id: cuponId },
                    data: { quantity: updateQuantity },
                });
            }

            return res
                .status(200)
                .send({ message: 'purchase successfully', orderPurchased });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    getOrder = async (req: Request, res: Response) => {
        try {
            const { orderId } = req.params;
            if (!orderId) {
                return res
                    .status(404)
                    .send({ message: 'Missing param order id' });
            }
            const order = await this.prisma.order.findFirst({
                where: { id: Number(orderId) },
                include: { orderDetail: { include: { product: true } } },
            });
            return res.status(200).send({ order });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    getOrders = async (req: Request, res: Response) => {
        try {
            const orders = await this.prisma.order.findMany({
                include: { orderDetail: { include: { product: true } } },
            });
            if (!orders) {
                return res
                    .status(404)
                    .send({ message: 'no orders in the database' });
            }
            return res.status(200).send({ orders });
        } catch (err) {
            return res.status(500).send({ mesagge: 'ups, server error', err });
        }
    };
}

const orderController = new OrderController();
export default orderController;
