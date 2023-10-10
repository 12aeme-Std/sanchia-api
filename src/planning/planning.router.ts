import { Router } from 'express';
import { PlanningController } from './planning.controller';
// import passport from 'passport';

const router = Router();
const planningController = new PlanningController();

// router.use(passport.authenticate('jwt', { session: false }));

router.get('/', planningController.getPlans.bind(planningController));
router.get('/:id', planningController.getSinglePlan.bind(planningController));
router.post('/', planningController.create.bind(planningController));

router.get(
    '/:id/specs',
    planningController.getPlanningSpecsByPlan.bind(planningController)
);
router.get(
    '/:id/specs/:specId',
    planningController.getSinglePlan.bind(planningController)
);
router.post(
    '/:id/specs',
    planningController.createPlanningSpecs.bind(planningController)
);
router.delete(
    '/:id/specs',
    planningController.deletePlanningSpecs.bind(planningController)
);
export default router;
