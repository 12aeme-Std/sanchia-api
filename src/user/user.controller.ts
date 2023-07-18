import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async register(req: Request, res: Response) {
        const user = this.userService.register(req.body);

        return res.status(200).json(user);
    }

    async findOne(req: Request, res: Response) {
        return res.status(200).json(
            await this.userService.findOne({
                id: Number(req.params.id),
            })
        );
    }

    async findAll(req: Request, res: Response) {
        const users = await this.userService.findAll({
            page: Number(req.query.page) ?? 1,
            limit: Number(req.query.limit) ?? 15,
        });

        return res.status(200).json(users);
    }

    async update(req: Request, res: Response) {
        return res
            .status(200)
            .json(
                await this.userService.update(Number(req.params.id), req.body)
            );
    }

    async delete(req: Request, res: Response) {
        return res
            .status(200)
            .json(await this.userService.delete(Number(req.params.id)));
    }
}
