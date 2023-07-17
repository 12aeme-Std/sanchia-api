import { Router } from 'express';
import { verifyToken } from '../utilities/middlewares';
import OrderController from '../controllers/order.controller';

const router = Router();
const orderController = new OrderController;

router.post('/', verifyToken, orderController.createOrder.bind(orderController));

router.get('/', verifyToken, orderController.getOrders.bind(orderController));
router.get('/:id', verifyToken, orderController.getOrder.bind(orderController));

export default router;
