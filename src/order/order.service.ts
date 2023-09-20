import { Order, Prisma, PrismaClient } from '@prisma/client';
import { HttpError } from '@common/http-error';
import { IPagination } from '@common/interfaces/pagination.interface';

export class OrderService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findOne(where: Prisma.OrderWhereUniqueInput): Promise<any> {
        return this.prisma.order
            .findUniqueOrThrow({ where, include: { productsOrders: true } })
            .catch(() => {
                throw new HttpError(404, 'Order not found');
            });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.OrderWhereUniqueInput;
            where?: Prisma.OrderWhereInput;
            orderBy?: Prisma.UserOrderByWithAggregationInput;
        }
    ): Promise<Order[]> {
        const { page, limit, cursor, where, orderBy } = params;
        return this.prisma.order.findMany({
            skip: Number(page) - 1,
            take: Number(limit),
            cursor,
            where,
            orderBy,
        });
    }

    async placeOrder(userId: number): Promise<any> {
        const result = await this.prisma.$transaction(async (tx) => {
            const cart = await tx.cart
                .findFirstOrThrow({
                    where: { userId },
                    select: {
                        id: true,
                        productsCarts: {
                            select: {
                                quantity: true,
                                product: {
                                    select: {
                                        id: true,
                                        price: true,
                                        stock: true,
                                        isAvailable: true,
                                    },
                                },
                                productId: true,
                            },
                        },
                    },
                })
                .catch(() => {
                    throw new HttpError(404, 'Cart not found');
                });

            const order = await tx.order.create({
                data: {
                    userId,
                    status: 'PREPARING',
                    store: 'SANCHIA',
                },
            });

            let totalAmount = 0;

            await Promise.all(
                cart.productsCarts.map(async ({ productId, quantity }) => {
                    const updatedProduct = await tx.product.update({
                        where: { id: productId },
                        data: {
                            stock: {
                                decrement: quantity,
                            },
                        },
                    });

                    if (!updatedProduct.isAvailable)
                        throw new HttpError(400, 'Product is disabled');

                    if (updatedProduct.stock < 0)
                        throw new HttpError(
                            400,
                            `Quantity (${quantity}) of product with SKU: ${productId} exceeds current stock (${updatedProduct.stock})`
                        );

                    await tx.productsOrders.create({
                        data: {
                            productId,
                            orderId: order.id,
                            quantity,
                        },
                    });

                    await tx.productsCarts.delete({
                        where: {
                            cartId_productId: {
                                cartId: cart.id,
                                productId,
                            },
                        },
                    });

                    totalAmount += updatedProduct.price * quantity;
                })
            );

            return tx.order.update({
                where: { id: order.id },
                data: {
                    total: totalAmount,
                },
                include: {
                    productsOrders: true,
                },
            });
        });

        return result;
    }
}
