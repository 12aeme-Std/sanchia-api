import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';

class ProductController {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    getProductById = async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;
            const product = await this.prisma.product.findFirst({
                where: { id: Number(productId) },
                include: {
                    category: true,
                    productImages: true,
                },
            });
            return res.status(200).send({ product });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    getProducts = async (req: Request, res: Response) => {
        try {
            const products = await this.prisma.product.findMany({
                include: {
                    category: true,
                    productImages: true,
                },
            });
            return res.status(200).send({ products });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    createProduct = async (req: Request, res: Response) => {
        try {
            if (req.files == null || !Array.isArray(req.files)) {
                return res
                    .status(400)
                    .json({ message: 'problems with the req.file' });
            }

            const images = req.files.map((file: Express.Multer.File) => {
                return { url: file.path };
            });

            const { name, description, price, stock, categoryId } = req.body;

            const newProduct = await this.prisma.product.create({
                data: {
                    name,
                    description,
                    price: Number(price),
                    stock: Number(stock),
                    categoryId: Number(categoryId),
                    productImages: { create: images },
                },
            });

            return res
                .status(200)
                .send({ message: 'Product created successfully', newProduct });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    updateProduct = async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;
            const { name, description, price, stock, categoryId } = req.body;
            const productUpdate = await this.prisma.product.update({
                where: { id: Number(productId) },
                data: { name, description, price, stock, categoryId },
            });
            return res.status(200).send({
                message: 'product updated successfully',
                productUpdate,
            });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };

    deleteProduct = async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;
            await this.prisma.product.delete({
                where: { id: Number(productId) },
            });
            return res
                .status(200)
                .send({ message: 'product deleted successfully' });
        } catch (err) {
            return res.status(500).send({ message: 'ups, server error', err });
        }
    };
}

const productController = new ProductController();
export default productController;
