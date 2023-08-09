import { Router } from 'express';
import categoryRouter from '@category/category.router';
import authRouter from '@auth/auth.router';
import productRouter from '@product/product.router';
import userRouter from '@user/user.router';
import warehouseRouter from '@warehouse/warehouse.router';
import recipeRouter from '@recipe/recipe.router';
import mixtureRouter from '@mixture/mixture.router';
import manufactureRouter from '@manufacture/manufacture.router';
import rawMaterialRouter from '@raw-material/raw-material.router';
import mixtureMachineRouter from '@mixture-machine/mixture-machine.router';
import manufactureMachineRouter from '@manufacture-machine/manufacture-machine.router';
import warehouseMovementRouter from '@warehouse-movement/warehouse-movement.router';

const router = Router();

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/auth', authRouter);
router.use('/category', categoryRouter);
router.use('/warehouses', warehouseRouter);
router.use('/mixture-machine', mixtureMachineRouter);
router.use('/manufacture-machine', manufactureMachineRouter);
router.use('/recipes', recipeRouter);
router.use('/mixtures', mixtureRouter);
router.use('/manufactures', manufactureRouter);
router.use('/raw-material', rawMaterialRouter);
router.use('/warehouse-movement', warehouseMovementRouter);

export default router;
