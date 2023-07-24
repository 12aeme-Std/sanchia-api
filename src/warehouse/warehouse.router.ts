import passport from 'passport';
import { WarehouseController } from './warehouse.controller';
import { Router } from 'express';

const router = Router();
const warehouseController = new WarehouseController();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', warehouseController.create.bind(warehouseController));

router.get('/:id', warehouseController.findOne.bind(warehouseController));
router.get('/', warehouseController.findAll.bind(warehouseController));

router.patch('/:id', warehouseController.update.bind(warehouseController));

router.delete('/:id', warehouseController.delete.bind(warehouseController));

export default router;
