import { ProductService } from '@product/product.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { AddProductToCartDto } from './dtos/add-product-on-cart.dto';
import { CartDto } from './dtos/cart.dto';
import { HttpError } from '@common/http-error';

export class CartService {
    private readonly prisma: PrismaClient;
    private readonly productService: ProductService;

    constructor() {
        this.prisma = new PrismaClient();
        this.productService = new ProductService();
    }

    async findOne(where: Prisma.CartWhereUniqueInput): Promise<any> {
        return this.prisma.cart
            .findUniqueOrThrow({ where, include: { productsCarts: true } })
            .catch(() => {
                throw new HttpError(404, 'Cart not found');
            });
    }

    async addProduct(
        userId: number,
        data: AddProductToCartDto
    ): Promise<CartDto> {
        if (!(await this.productService.isAvailable(data.id, data.quantity)))
            throw new HttpError(400, 'Quantity exceeds current stock');

        const cart = await this.findOne({ userId });

        await this.prisma.productsCarts.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: data.id,
                },
            },
            create: {
                productId: data.id,
                quantity: data.quantity,
                cartId: cart.id,
            },
            update: {
                quantity: data.quantity,
            },
            select: {
                product: true,
                quantity: true,
            },
        });

        return this.findOne({ userId: cart.userId });
    }

    async deleteProductOnCart(userId: number, id: number): Promise<CartDto> {
        const cart = await this.findOne({ userId });

        await this.prisma.productsCarts
            .findUniqueOrThrow({
                where: {
                    cartId_productId: {
                        productId: id,
                        cartId: cart.id,
                    },
                },
            })
            .catch(() => {
                throw new HttpError(404, `Product ${id} is not in this cart`);
            });

        await this.prisma.productsCarts.delete({
            where: {
                cartId_productId: {
                    productId: id,
                    cartId: cart.id,
                },
            },
            select: {
                product: true,
                quantity: true,
            },
        });

        return this.findOne({ userId: cart.userId });
    }
}
