import { Router } from 'express';
import preOrderController from '../controllers/preorder.controller';
import { verifyToken, verifyRole } from '../utilities/middlewares';

class PreOrderRouter {
    public router: Router = Router();

    constructor() {
        this.getPreOrderByClientId();
        this.getPreOrders();
        this.createPreOrder();
        this.updatePreOrder();
        this.deletePreOrder();
    }

    public getPreOrderByClientId = () => {
        this.router.get(
            '/:clientId',
            verifyToken,
            preOrderController.getPreOrderByClientId
        );
    };

    public getPreOrders = () => {
        this.router.get(
            '/',
            verifyToken,
            verifyRole('read', 'preorder'),
            preOrderController.getPreOrders
        );
    };

    public createPreOrder = () => {
        this.router.post(
            '/:clientId',
            verifyToken,
            preOrderController.createPreOrder
        );
    };

    public updatePreOrder = () => {
        this.router.put(
            '/:clientId',
            verifyToken,
            preOrderController.updatePreOrder
        );
    };

    public deletePreOrder = () => {
        this.router.delete(
            '/:clientId',
            verifyToken,
            preOrderController.deletePreOrder
        );
    };
}

const preOrderRouter = new PreOrderRouter();
export default preOrderRouter.router;
