import { Router } from 'express';
import { MixtureController } from './mixture.controller';
import passport from 'passport';

const router = Router();
const mixtureController = new MixtureController();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', mixtureController.create.bind(mixtureController));

router.get('/:id', mixtureController.findOne.bind(mixtureController));
router.get('/', mixtureController.findAll.bind(mixtureController));

router.patch('/:id', mixtureController.update.bind(mixtureController));

router.delete('/:id', mixtureController.delete.bind(mixtureController));

export default router;
