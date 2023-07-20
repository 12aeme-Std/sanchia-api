import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

router.use('/login', authController.login.bind(authController));

export default router;
