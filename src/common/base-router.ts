import userRouter from '@user/user.router';
import { Router } from 'express';

const router = Router();

router.use('/users', userRouter);

export default router;
