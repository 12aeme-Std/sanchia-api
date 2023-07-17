import { Router } from 'express';
import { verifyToken } from '../utilities/middlewares';
import CartController from '../controllers/cart.controller';

const router = Router();
const cartController = new CartController();

router.post('/:productId', verifyToken, cartController.addToCart.bind(cartController));

router.get('/', verifyToken, cartController.getCart.bind(cartController));

router.delete('/:productId', verifyToken, cartController.removeToCart.bind(cartController));

export default router;
