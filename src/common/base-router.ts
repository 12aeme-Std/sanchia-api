import { Router } from 'express';
import authRouter from '@auth/auth.router';
import categoryRouter from '@category/category.router';
import productRouter from '@product/product.router';
import userRouter from '@user/user.router';
import warehouseRouter from '@warehouse/warehouse.router';
import machineRouter from '@machine/machine.router';
import recipeRouter from '@recipe/recipe.router';

const router = Router();

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/auth', authRouter);
router.use('/category', categoryRouter);
router.use('/warehouse', warehouseRouter);
router.use('/machines', machineRouter);
router.use('/recipes', recipeRouter);

export default router;
