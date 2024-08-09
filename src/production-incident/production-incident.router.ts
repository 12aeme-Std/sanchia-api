import { Router } from 'express';
import { ProductionIncidentController } from './production-incident.controller';
// import passport from 'passport';

const router = Router();
const productionIncidentController = new ProductionIncidentController();

// router.use(passport.authenticate('jwt', { session: false }));
router.get(
    '/',
    productionIncidentController.getMachineManagers.bind(
        productionIncidentController
    )
);

router.post(
    '/',
    productionIncidentController.createMachineManager.bind(
        productionIncidentController
    )
);

router.put(
    '/:id',
    productionIncidentController.updateMachineManager.bind(
        productionIncidentController
    )
);

router.delete(
    '/:id',
    productionIncidentController.softDeleteMachineManager.bind(
        productionIncidentController
    )
);

export default router;
