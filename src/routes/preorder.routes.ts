import { Router } from 'express';
import { verifyToken, verifyRole } from '../utilities/middlewares';
import PreOrderController from '../controllers/preorder.controller';

const router = Router();
const preOrderController = new PreOrderController();

router.get('/', verifyToken, verifyRole('read', 'preorder'), preOrderController.getPreOrders.bind(preOrderController));
router.get('/:id', verifyToken, preOrderController.getPreOrderByClientId.bind(preOrderController));

router.post('/:id', verifyToken, preOrderController.createPreOrder.bind(preOrderController));

router.patch('/:id', verifyToken, preOrderController.updatePreOrder.bind(preOrderController));

router.delete('/:id', verifyToken, preOrderController.deletePreOrder.bind(preOrderController));

export default router;
