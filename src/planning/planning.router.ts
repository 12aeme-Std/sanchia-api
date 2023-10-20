import { Router } from 'express';
import { PlanningController } from './planning.controller';
// import passport from 'passport';

const router = Router();
const planningController = new PlanningController();

// router.use(passport.authenticate('jwt', { session: false }));
router.get('/sync', planningController.syncData.bind(planningController));

router.get('/', planningController.getPlans.bind(planningController));
router.get('/:id', planningController.getSinglePlan.bind(planningController));
router.post('/', planningController.create.bind(planningController));

router.get(
    '/:id/reports',
    planningController.getReportData.bind(planningController)
);

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

router.post(
    '/:id/specs/:specId/schedules',
    planningController.createPlanningSchedule.bind(planningController)
);

router.get(
    '/:id/specs/:specId/schedules',
    planningController.getPlanningSchedulePlanningSpec.bind(planningController)
);

router.get(
    '/:id/specs/:specId/schedules/:scheduleId',
    planningController.getSinglePlanningSchedule.bind(planningController)
);

router.post(
    '/:id/specs/productions',
    planningController.createProductionSpec.bind(planningController)
);

router.get(
    '/:id/specs/:iden/productions',
    planningController.getProductionByPlanSpecOrSchedule.bind(
        planningController
    )
);

export default router;
