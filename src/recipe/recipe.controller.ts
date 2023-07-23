import { RecipeService } from './recipe.service';
import { Request, Response } from 'express';

export class RecipeController {
    private readonly recipeService: RecipeService;

    constructor() {
        this.recipeService = new RecipeService();
    }

    async create(req: Request, res: Response) {
        return res.status(200).json(await this.recipeService.create(req.body));
    }

    async findOne(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.recipeService.findOne({ id: Number(req.params.id) })
            );
    }

    async findAll(req: Request, res: Response) {
        const machines = await this.recipeService.findAll({
            page: Number(req.params.page ?? 1),
            limit: Number(req.params.limit ?? 15),
        });

        return res.status(200).json(machines);
    }

    async update(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.recipeService.update(Number(req.params.id), req.body)
            );
    }

    async delete(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.recipeService.delete(Number(req.params.id)));
    }
}
