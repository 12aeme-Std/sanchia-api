import { Request, Response } from 'express';
import { CartService } from './cart.service';

export class CartController {
    private readonly cartService: CartService;

    constructor() {
        this.cartService = new CartService();
    }

    async addProductToCart(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.cartService.addProduct(req.user.id, req.body));
    }

    async findOne(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.cartService.findOne({ userId: req.user.id }));
    }

    async delete(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.cartService.deleteProductOnCart(
                    req.user.id,
                    Number(req.params.id)
                )
            );
    }
}
