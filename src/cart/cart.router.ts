import { Router } from 'express';
import passport from 'passport';
import { CartController } from './cart.controller';

const router = Router();
const cartController = new CartController();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', cartController.addProductToCart.bind(cartController));

router.get('/', cartController.findOne.bind(cartController));

router.delete('/:id', cartController.delete.bind(cartController));

export default router;
