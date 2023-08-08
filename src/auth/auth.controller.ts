import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { loginSchema } from './auth.validator';
import validateSchema from '@middlewares/validation.mid';

export class AuthController {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(req: Request, res: Response) {
        validateSchema(req.body, loginSchema);

        return res.status(200).json(await this.authService.login(req.body));
    }
}
