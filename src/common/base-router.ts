import { Router } from 'express';
import authRouter from '@auth/auth.router';
import categoryRouter from '@category/category.router';
import productRouter from '@product/product.router';
import userRouter from '@user/user.router';

const router = Router();

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/auth', authRouter);
router.use('/categories', categoryRouter);

export default router;
