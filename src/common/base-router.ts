import { Router } from 'express';
import categoryRouter from '@category/category.router';
import authRouter from '@auth/auth.router';
import productRouter from '@product/product.router';
import userRouter from '@user/user.router';
import warehouseRouter from '@warehouse/warehouse.router';
import machineRouter from '@machine/machine.router';
import recipeRouter from '@recipe/recipe.router';
import mixtureRouter from '@mixture/mixture.router';
import rawMaterialRouter from '@raw-material/raw-material.router';

const router = Router();

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/auth', authRouter);
router.use('/category', categoryRouter);
router.use('/warehouses', warehouseRouter);
router.use('/machines', machineRouter);
router.use('/recipes', recipeRouter);
router.use('/mixtures', mixtureRouter);
router.use('/raw-material', rawMaterialRouter);

export default router;
