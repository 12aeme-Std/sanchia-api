import { Router } from 'express';
import { MachineController } from './machine.controller';
import passport from 'passport';

const router = Router();
const machineController = new MachineController();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', machineController.create.bind(machineController));

router.get('/:id', machineController.findOne.bind(machineController));
router.get('/', machineController.findAll.bind(machineController));

router.patch('/:id', machineController.update.bind(machineController));

router.delete('/:id', machineController.delete.bind(machineController));

export default router;
