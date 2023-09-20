import { Request, Response } from 'express';
import { OrderService } from './order.service';

export class OrderController {
    private readonly orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    async placeOrder(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.orderService.placeOrder(req.user.id));
    }

    async findOne(req: Request, res: Response) {
        return res.status(200).json(
            await this.orderService.findOne({
                id: Number(req.params.id),
            })
        );
    }

    async findAll(req: Request, res: Response) {
        const products = await this.orderService.findAll({
            page: Number(req.query.page) ?? 1,
            limit: Number(req.query.limit) ?? 15,
        });

        return res.status(200).json(products);
    }
}
