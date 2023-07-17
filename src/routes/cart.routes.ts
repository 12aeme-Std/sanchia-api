import { Router } from 'express';
import cartController from '../controllers/cart.controller';
import { verifyToken } from '../utilities/middlewares';

class CartRouter {
    public router: Router = Router();

    constructor() {
        this.getCart();
        this.addToCart();
        this.removeToCart();
    }

    public getCart = () => {
        this.router.get('/', verifyToken, cartController.getCart);
    };

    public addToCart = () => {
        this.router.post('/:productId', verifyToken, cartController.addToCart);
    };

    public removeToCart = () => {
        this.router.delete(
            '/:productId',
            verifyToken,
            cartController.removeToCart
        );
    };
}

const cartRouter = new CartRouter();
export default cartRouter.router;
