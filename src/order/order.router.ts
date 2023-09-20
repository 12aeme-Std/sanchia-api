import { Router } from 'express';
import passport from 'passport';
import { OrderController } from './order.controller';

const router = Router();
const orderController = new OrderController();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', orderController.placeOrder.bind(orderController));

router.get('/:id', orderController.findOne.bind(orderController));
router.get('/', orderController.findAll.bind(orderController));

export default router;
