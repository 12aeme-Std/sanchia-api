import { Router } from 'express';
import { ManufactureMachineController } from './manufacture-machine.controller';
import passport from 'passport';

const router = Router();
const manufactureMachineController = new ManufactureMachineController();

router.use(passport.authenticate('jwt', { session: false }));

router.post(
    '/',
    manufactureMachineController.create.bind(manufactureMachineController)
);

router.get(
    '/:id',
    manufactureMachineController.findOne.bind(manufactureMachineController)
);
router.get(
    '/',
    manufactureMachineController.findAll.bind(manufactureMachineController)
);

router.patch(
    '/:id',
    manufactureMachineController.update.bind(manufactureMachineController)
);

router.delete(
    '/:id',
    manufactureMachineController.delete.bind(manufactureMachineController)
);

export default router;
