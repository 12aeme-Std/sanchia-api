import { Router } from 'express';
import { MixtureMachineController } from './mixture-machine.controller';
import passport from 'passport';

const router = Router();
const mixtureMachineController = new MixtureMachineController();

router.use(passport.authenticate('jwt', { session: false }));

router.post(
    '/',
    mixtureMachineController.create.bind(mixtureMachineController)
);

router.get(
    '/:id',
    mixtureMachineController.findOne.bind(mixtureMachineController)
);
router.get(
    '/',
    mixtureMachineController.findAll.bind(mixtureMachineController)
);

router.patch(
    '/:id',
    mixtureMachineController.update.bind(mixtureMachineController)
);

router.delete(
    '/:id',
    mixtureMachineController.delete.bind(mixtureMachineController)
);

export default router;
