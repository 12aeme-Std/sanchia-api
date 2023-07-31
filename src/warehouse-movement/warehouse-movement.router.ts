import { Router } from 'express';
import passport from 'passport';
import { WarehouseMovementController } from './warehouse-movement.controller';

const router = Router();
const warehouseMovementController = new WarehouseMovementController();

router.use(passport.authenticate('jwt', { session: false }));

router.post(
    '/',
    warehouseMovementController.create.bind(warehouseMovementController)
);

router.get(
    '/type',
    warehouseMovementController.findByType.bind(warehouseMovementController)
);
router.get(
    '/:id',
    warehouseMovementController.findOne.bind(warehouseMovementController)
);
router.get(
    '/',
    warehouseMovementController.findAll.bind(warehouseMovementController)
);

export default router;
