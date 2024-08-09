import { Router } from 'express';
import { MachineManagerController } from './machine-manager.controller';
// import passport from 'passport';

const router = Router();
const machineManagerController = new MachineManagerController();

// router.use(passport.authenticate('jwt', { session: false }));
router.get(
    '/',
    machineManagerController.getMachineManagers.bind(machineManagerController)
);

router.post(
    '/',
    machineManagerController.createMachineManager.bind(machineManagerController)
);

router.put(
    '/:id',
    machineManagerController.updateMachineManager.bind(machineManagerController)
);

router.delete(
    '/:id',
    machineManagerController.softDeleteMachineManager.bind(
        machineManagerController
    )
);

export default router;
