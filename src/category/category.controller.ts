import { Request, Response } from 'express';
import { CategoryService } from './category.service';
export class CategoryController {
    private readonly categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    async create(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.categoryService.create(req.body));
    }

    async findOne(req: Request, res: Response) {
        return res.status(200).json(
            await this.categoryService.findOne({
                id: Number(req.params.id),
            })
        );
    }

    async findAll(req: Request, res: Response) {
        const products = await this.categoryService.findAll({
            page: Number(req.query.page) ?? 1,
            limit: Number(req.query.limit) ?? 15,
        });

        return res.status(200).json(products);
    }

    async update(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.categoryService.update(
                    Number(req.params.id),
                    req.body
                )
            );
    }

    async delete(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.categoryService.delete(Number(req.params.id)));
    }
}
