import validateSchema from '@middlewares/validation.mid';
import { RecipeService } from './recipe.service';
import { Request, Response } from 'express';
import { CreateRecipeSchema, UpdateRecipeSchema } from './recipe.validator';

export class RecipeController {
    private readonly recipeService: RecipeService;

    constructor() {
        this.recipeService = new RecipeService();
    }

    async create(req: Request, res: Response) {
        validateSchema(req.body, CreateRecipeSchema);
        return res.status(200).json(await this.recipeService.create(req.body));
    }

    async createVariant(req: Request, res: Response) {
        validateSchema(req.body, CreateRecipeSchema);
        return res
            .status(200)
            .json(
                await this.recipeService.createVariant(
                    req.body,
                    Number(req.params.id)
                )
            );
    }

    async findOne(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.recipeService.findOne({ id: Number(req.params.id) })
            );
    }

    async findAll(req: Request, res: Response) {
        const recipes = await this.recipeService.findAll({
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 15),
        });

        return res.status(200).json(recipes);
    }

    async findAllVariants(req: Request, res: Response) {
        const recipes = await this.recipeService.findAllVariants({
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 15),
            recipeId: Number(req.params.id),
        });

        return res.status(200).json(recipes);
    }

    async update(req: Request, res: Response) {
        validateSchema(req.body, UpdateRecipeSchema);
        return res
            .status(200)
            .json(
                await this.recipeService.update(Number(req.params.id), req.body)
            );
    }

    async updateVariant(req: Request, res: Response) {
        validateSchema(req.body, UpdateRecipeSchema);
        return res
            .status(200)
            .json(
                await this.recipeService.updateVariant(
                    Number(req.params.id),
                    Number(req.params.parentId),
                    req.body
                )
            );
    }

    async delete(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.recipeService.delete(Number(req.params.id)));
    }
}
