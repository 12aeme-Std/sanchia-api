import { Router } from 'express';
import { ProductionPlanController } from './production-plan.controller';

const router = Router();
const productionPlanController = new ProductionPlanController();

// router.use(passport.authenticate('jwt', { session: false }));
router.get(
    '/sync-materials',
    productionPlanController.methodX.bind(productionPlanController)
);

export default router;
