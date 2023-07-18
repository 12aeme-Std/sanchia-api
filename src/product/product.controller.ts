import { ProductService } from './product.service';
import { Request, Response } from 'express';

export class ProductController {
    private readonly productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    async create(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.productService.createProdut(req.body));
    }

    async findOne(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.productService.findOne({ id: Number(req.params.id) })
            );
    }

    async findAll(req: Request, res: Response) {
        const products = await this.productService.findAll({
            page: Number(req.query.page) ?? 1,
            limit: Number(req.query.limit) ?? 15,
        });

        return res.status(200).json(products);
    }

    async update(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.productService.update(
                    Number(req.params.id),
                    req.body
                )
            );
    }

    async delete(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.productService.delete(Number(req.params.id)));
    }
}
