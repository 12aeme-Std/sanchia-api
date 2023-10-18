import { Router } from 'express';
import { ManufactureController } from './manufacture.controller';
import passport from 'passport';

const router = Router();
const manufactureController = new ManufactureController();

router.use(passport.authenticate('jwt', { session: false }));

router.post(
    '/result',
    manufactureController.finishManufactureProcess.bind(manufactureController)
);
router.get(
    '/products',
    manufactureController.getManufactureProductsWithRecipe.bind(
        manufactureController
    )
);
router.post('/', manufactureController.create.bind(manufactureController));

router.get('/:id', manufactureController.findOne.bind(manufactureController));
router.get('/', manufactureController.findAll.bind(manufactureController));

export default router;
