import { Router } from 'express';
import { ProductionPlanController } from './production-plan.controller';

const router = Router();
const productionPlanController = new ProductionPlanController();

// router.use(passport.authenticate('jwt', { session: false }));
router.get(
    '/:id/results',
    productionPlanController.getResultsByProductionPlan.bind(
        productionPlanController
    )
);

router.post(
    '/:id/results',
    productionPlanController.createResult.bind(productionPlanController)
);

export default router;
